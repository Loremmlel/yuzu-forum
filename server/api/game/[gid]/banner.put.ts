import {UserModel} from "~/server/models/user";
import {GameModel} from "~/server/models/game";
import mongoose from "mongoose";
import {saveGameBanner} from "~/server/api/game/utils/saveGameBanner";
import {GameHistoryModel} from "~/server/models/gameHistory";

export default defineEventHandler(async (event) => {
    const bannerFile = await readMultipartFormData(event)
    if (!bannerFile || !Array.isArray(bannerFile)) {
        return yuzuError(event, 10110)
    }

    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, 10609)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const user = await UserModel.findOne({uid: userInfo.uid}).lean()
    if (!user) {
        return yuzuError(event, 10101)
    }

    const game = await GameModel.findOne({gid, status: {$ne: 1}}).lean()
    if (!game) {
        return yuzuError(event, 10610)
    }

    if (userInfo.uid !== game.uid && user.roles < 2) {
        return yuzuError(event, 10630)
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const res = await saveGameBanner(bannerFile[0].data, Number(gid))
        if (!res) {
            return yuzuError(event, 10116)
        }
        if (typeof res === 'number') {
            return yuzuError(event, res)
        }

        await GameModel.updateOne(
            {gid},
            {$set: {banner: res.url}}
        )
        await GameHistoryModel.create({
            gid: Number(gid),
            uid: userInfo.uid,
            time: Date.now(),
            action: 'updated',
            type: 'banner',
            content: ''
        })
        await session.commitTransaction()
        return '修改游戏封面成功!'
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})