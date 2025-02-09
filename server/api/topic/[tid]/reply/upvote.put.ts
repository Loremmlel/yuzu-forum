import {ReplyModel} from "~/server/models/reply";
import {UserModel} from "~/server/models/user";
import mongoose from "mongoose";
import {createMessage} from "~/server/utils/message";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

async function updateReplyUpvote(uid: number, rid: number): Promise<ErrorCode> {
    const reply = await ReplyModel.findOne({rid})
    if (!reply) {
        return ErrorCode.ReplyNotFound
    }

    const userInfo = await UserModel.findOne({uid})
    if (!userInfo) {
        return ErrorCode.LoginExpired
    }

    const point = userInfo.point
    if (point < 1100) {
        return ErrorCode.InsufficientPointsForPushReply
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await ReplyModel.updateOne(
            {rid},
            {
                $set: {upvoteTime: Date.now()},
                $push: {upvotes: uid}
            }
        )
        await UserModel.updateOne({uid}, {$inc: {point: -2}})
        await UserModel.updateOne(
            {uid: reply.rUid},
            {$inc: {point: 1, upvote: 1}}
        )
        await createMessage(
            uid,
            reply.rUid,
            'upvoted',
            reply.content.slice(0, 233),
            reply.tid,
            0
        )

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
    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, ErrorCode.TopicIdReadFailed)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const {rid}: { rid: string } = await getQuery(event)
    if (!rid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    const result = await updateReplyUpvote(userInfo.uid, parseInt(rid))
    if (result !== ErrorCode.NoError) {
        return yuzuError(event, result)
    }

    return ReturnMessage.UpvoteReply
})