import mongoose from "mongoose";
import {GameModel} from "~/server/models/game";
import {UserModel} from "~/server/models/user";
import {createDeduplicatedMessage} from "~/server/utils/message";
import {findFirstNonNullProperty} from "~/server/utils/findFirstNonNullProperty";
import {ErrorCode} from "~/error/errorCode";

async function updateGameLike(gid: number, uid: number): Promise<ErrorCode> {
    const game = await GameModel.findOne({ gid, status: { $ne: 1 } }).lean()
    if (!game) {
        return ErrorCode.TopicNotFound
    }

    if (uid === game.uid) {
        return ErrorCode.NoError
    }

    const isLikedGame = game.likes.includes(uid)
    const pointAmount = isLikedGame ? -1 : 1

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await GameModel.updateOne(
            { gid },
            { [isLikedGame ? '$pull' : '$addToSet']: { likes: uid } }
        )

        await UserModel.updateOne(
            { uid },
            { [isLikedGame ? '$pull' : '$addToSet']: { likeGame: gid } }
        )

        await UserModel.updateOne(
            { uid: game.uid },
            { $inc: { point: pointAmount, like: pointAmount } }
        )

        if (!isLikedGame) {
            await createDeduplicatedMessage(
                uid,
                game.uid,
                'liked',
                findFirstNonNullProperty(game.name),
                0,
                gid
            )
        }
        await session.commitTransaction()
        return ErrorCode.NoError
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
}

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.GameIdReadFailed)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const result = await updateGameLike(Number(gid), uid)
    if (result !== ErrorCode.NoError) {
        return yuzuError(event, result)
    }

    return '点赞游戏成功!'
})