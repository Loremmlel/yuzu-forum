import {H3Event} from "h3";
import {UserModel} from "~/server/models/user";
import {GameModel} from "~/server/models/game";
import {GamePRModel} from "~/server/models/gamePR";
import mongoose from "mongoose";
import {GameHistoryModel} from "~/server/models/gameHistory";
import {mergeLanguages} from "~/server/utils/objectUtils";
import {ErrorCode} from "~/error/errorCode";

async function checkMerge(event: H3Event) {
    const { gprid }: { gprid: number } = await readBody(event)
    if (!gprid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const user = await UserModel.findOne({ uid: userInfo.uid }).lean()
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }

    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    const game = await GameModel.findOne({ gid }).lean()
    if (!game) {
        return yuzuError(event, ErrorCode.GameNotFound)
    }

    if (userInfo.uid !== game.uid && user.roles < 2) {
        return yuzuError(event, ErrorCode.NoPermissionForUpdateRequest)
    }

    return { uid: userInfo.uid, gprid, gid, game: game }
}

export default defineEventHandler(async (event) => {
    const result = await checkMerge(event)
    if (!result) {
        return
    }
    const { uid, gprid, gid, game } = result

    const gamePR = await GamePRModel.findOne({ gprid }).lean()
    if (!gamePR) {
        return yuzuError(event, ErrorCode.GameNotFound)
    }
    if (gamePR.status !== 0) {
        return yuzuError(event, ErrorCode.UpdateRequestAlreadyProcessed)
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await GamePRModel.updateOne(
            { gprid },
            { status: 1, completedTime: Date.now() }
        )
        await GameHistoryModel.create({
            gid: gamePR.gid,
            uid,
            time: Date.now(),
            action: 'merged',
            type: 'pr',
            content: `#${gamePR.index}`
        })
        await GameModel.updateOne(
            { gid },
            {
                name: mergeLanguages(game.name, gamePR.game?.name ?? {}),
                introduction: mergeLanguages(
                    game.introduction,
                    gamePR.game?.introduction ?? {}
                ),
                alias: gamePR.game?.alias?.filter((str) => str !== ''),
                series: gamePR.game?.series?.map((s) => parseInt(s)),
                official: gamePR.game?.official?.filter((str) => str !== ''),
                engine: gamePR.game?.engine?.filter((str) => str !== ''),
                tags: gamePR.game?.tags?.filter((str) => str !== ''),
                $addToSet: { contributor: uid }
            }
        )
        await UserModel.updateOne(
            { uid },
            { $addToSet: { contributeGame: gid } }
        )

        if (uid !== gamePR.uid) {
            await GameModel.updateOne(
                { gid },
                { $addToSet: { contributor: gamePR.uid } }
            )
            await UserModel.updateOne(
                { uid: gamePR.uid },
                {
                    $inc: { point: 1 },
                    $addToSet: { contributeGame: gid }
                }
            )
            await createMessage(
                uid,
                gamePR.uid,
                'merged',
                `#${gamePR.index}`,
                0,
                gamePR.gid
            )
        }
        await session.commitTransaction()
        return '合并游戏拉取请求成功!'
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        await session.endSession()
    }
})