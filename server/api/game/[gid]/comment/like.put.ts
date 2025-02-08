import {UserModel} from "~/server/models/user";
import {GameCommentModel} from "~/server/models/gameComment";
import mongoose from "mongoose";

async function updateGameCommentLike(gcid: number, uid: number) {
    const comment = await GameCommentModel.findOne({ gcid }).lean()
    if (!comment) {
        return 10622
    }
    if (comment.cUid === uid) {
        return
    }
    if (comment.likes.includes(uid)) {
        return 10624
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await GameCommentModel.updateOne({ gcid }, { $addToSet: { likes: uid } })
        await UserModel.updateOne(
            { uid: comment.cUid },
            { $inc: { point: 1, like: 1 } }
        )
        await createMessage(
            uid,
            comment.cUid,
            'liked',
            comment.content.slice(0, 233),
            0,
            comment.gid
        )
        await session.commitTransaction()
        return null
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        await session.endSession()
    }
}

export default defineEventHandler(async (event) => {
    const { gcid }: { gcid: string } = await getQuery(event)
    if (!gcid) {
        return yuzuError(event, 10507)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const uid = userInfo.uid

    const result = await updateGameCommentLike(parseInt(gcid), uid)
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return '点赞游戏评论成功!'
})