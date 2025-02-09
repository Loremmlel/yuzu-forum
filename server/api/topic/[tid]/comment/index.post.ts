import {H3Event} from "h3";
import {TopicComment, TopicCreateCommentRequestData} from "~/types/api/topicComment";
import {checkComment} from "~/server/api/topic/utils/checkComment";
import mongoose from "mongoose";
import {CommentModel} from "~/server/models/comment";
import {UserModel} from "~/server/models/user";
import {TopicModel} from "~/server/models/topic";
import {ReplyModel} from "~/server/models/reply";
import {createMessage} from "~/server/utils/message";
import {ErrorCode} from "~/code&message/errorCode";

async function readReply(event: H3Event) {
    const {rid, toUid, content}: TopicCreateCommentRequestData = await readBody(event)
    if (!rid || !toUid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const res = checkComment(content)
    if (res !== ErrorCode.NoError) {
        return yuzuError(event, res)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, ErrorCode.TopicIdReadFailed)
    }
    return {
        rid,
        tid: Number(tid),
        cUid: userInfo.uid,
        toUid: toUid,
        content
    }
}

export default defineEventHandler(async (event) => {
    const result = await readReply(event)
    if (!result) {
        return
    }
    const {rid, tid, cUid, toUid, content} = result

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const newComment = await CommentModel.create({rid, tid, cUid, toUid, content})
        const commentUser = await UserModel.findOneAndUpdate(
            {uid: cUid},
            {$addToSet: {comment: newComment.cid}}
        )
        if (!commentUser) {
            return yuzuError(event, ErrorCode.UserNotFound)
        }

        const toUser = await UserModel.findOne({uid: toUid})
        if (!toUser) {
            return yuzuError(event, ErrorCode.UserNotFound)
        }

        await TopicModel.updateOne({tid}, {$inc: {comments: 1}}).lean()
        await ReplyModel.findOneAndUpdate(
            {rid},
            {$addToSet: {comment: newComment.cid}}
        ).lean()

        if (cUid !== toUid) {
            await createMessage(
                cUid,
                toUid,
                'commented',
                newComment.content,
                tid,
                0
            )
            await UserModel.updateOne({uid: toUid}, {$inc: {point: 1}})
        }
        const response: TopicComment = {
            cid: newComment.cid,
            rid: newComment.rid,
            tid: newComment.tid,
            user: {
                uid: commentUser.uid,
                name: commentUser.name,
                avatar: commentUser.avatar
            },
            toUser: {
                uid: toUser.uid,
                name: toUser.name
            },
            content: newComment.content,
            likes: {
                count: newComment.likes.length,
                isLiked: newComment.likes.includes(cUid)
            }
        }
        await session.commitTransaction()
        return response
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})