import {TopicLikeCommentRequestData} from "~/types/api/topicComment";
import {CommentModel} from "~/server/models/comment";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {createMessage} from "~/server/utils/message";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const { cid }: TopicLikeCommentRequestData = await getQuery(event)
    if (!cid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    const comment = await CommentModel.findOne({ cid }).lean()
    if (!comment) {
        return yuzuError(event, ErrorCode.CommentNotFound)
    }
    if (userInfo.uid === comment.cUid) {
        return
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await CommentModel.updateOne(
            { cid },
            { $addToSet: { likes: userInfo.uid } }
        )
        await UserModel.updateOne(
            { uid: comment.cUid },
            { $inc: { like: 1, point: 1 } }
        )

        if (comment) {
            await createMessage(
                userInfo.uid,
                comment.cUid,
                'liked',
                comment.content.slice(0, 233),
                comment.tid,
                0
            )
        }
        await session.commitTransaction()
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }

    return '点赞评论成功!'
})