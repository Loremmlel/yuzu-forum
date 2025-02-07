import mongoose from "mongoose";
import {GameModel} from "~/server/models/game";
import {UserModel} from "~/server/models/user";
import {createDeduplicatedMessage} from "~/server/utils/message";
import {findFirstNonNullProperty} from "~/server/utils/findFirstNonNullProperty";

async function updateGameLike(gid: number, uid: number) {
    const game = await GameModel.findOne({ gid, status: { $ne: 1 } }).lean()
    if (!game) {
        return 10211
    }

    if (uid === game.uid) {
        return null
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
        return null
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
        return yuzuError(event, 10609)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const uid = userInfo.uid

    const result = await updateGameLike(Number(gid), uid)
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return '点赞游戏成功!'
})