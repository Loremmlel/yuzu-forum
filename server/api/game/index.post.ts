import {H3Event} from "h3";
import {GameModel} from "~/server/models/game";
import {checkGamePublish} from "~/server/api/game/utils/checkGamePublish";
import {UserModel} from "~/server/models/user";
import mongoose from "mongoose";
import {saveGameBanner} from "~/server/api/game/utils/saveGameBanner";
import {GameLinkModel} from "~/server/models/gameLink";
import {GameHistoryModel} from "~/server/models/gameHistory";
import {ErrorCode} from "~/error/errorCode";

async function readGame(event: H3Event) {
    const formData = await readFormData(event)

    const vndbIdData = formData.get('vndbId')
    const nameData = formData.get('name')
    const introductionData = formData.get('introduction')
    const aliasesData = formData.get('aliases')
    const bannerData = formData.get('banner')
    if (
        !vndbIdData ||
        !nameData ||
        !introductionData ||
        !aliasesData ||
        !bannerData
    ) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const vndbId = vndbIdData.toString()
    const name = JSON.parse(nameData.toString()) as YuzuLanguage
    const introduction = JSON.parse(introductionData.toString()) as YuzuLanguage
    const aliases = JSON.parse(aliasesData.toString())
    const banner = await new Response(bannerData).arrayBuffer()
    const res = checkGamePublish(vndbId, name, introduction, aliases)
    if (res !== ErrorCode.NoError) {
        return yuzuError(event, res)
    }

    const game = await GameModel.findOne({vndb_id: vndbId})
    if (game) {
        return yuzuError(event, ErrorCode.DuplicateVNDBEntry)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    return {
        uid,
        vndbId,
        name,
        banner,
        introduction,
        aliases
    }
}

export default defineEventHandler(async (event) => {
    const result = await readGame(event)
    if (!result) {
        return
    }
    const {uid, vndbId, name, banner, introduction, aliases} = result

    const user = await UserModel.findOne({uid})
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    if (user.point / 10 < user.dailyGameCount) {
        return yuzuError(event, ErrorCode.DailyGameLimitExceeded)
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const newGame = await GameModel.create({
            vndbId,
            uid,
            name,
            introduction,
            alias: aliases,
            time: Date.now()
        })
        await UserModel.updateOne(
            {uid},
            {
                $addToSet: {
                    game: newGame.gid,
                    contributeGame: newGame.gid
                },
                $inc: {
                    dailyGameCount: 1,
                    dailyImageCount: 1,
                    point: 3
                }
            }
        )
        await GameModel.updateOne(
            {gid: newGame.gid},
            {$addToSet: {contributor: uid}}
        )

        const res = await saveGameBanner(banner, newGame.gid)
        if (!res) {
            return yuzuError(event, ErrorCode.UnknownImageUploadError)
        }
        if (typeof res === 'number') {
            return yuzuError(event, res)
        }

        await GameModel.updateOne(
            {gid: newGame.gid},
            {$set: {banner: res.url}}
        )
        await GameLinkModel.create({
            gid: newGame.gid,
            uid,
            name: 'VNDB',
            link: `https://vndb.org/${vndbId}`
        })
        await GameHistoryModel.create({
            gid: newGame.gid,
            uid,
            time: Date.now(),
            action: 'created',
            type: 'game',
            content: ''
        })
        await session.commitTransaction()
        return newGame.gid
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})