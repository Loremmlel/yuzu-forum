import {ReplyModel} from "~/server/models/reply";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {createDeduplicatedMessage} from "~/server/utils/message";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

async function updateReplyLike(uid: number, rid: number) {
    const reply = await ReplyModel.findOne({rid})
    if (!reply) {
        return ErrorCode.ReplyNotFound
    }
    if (uid === reply.rUid) {
        return
    }

    const isLikedReply = reply.likes.includes(uid)
    const pointAmount = isLikedReply ? -1 : 1

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await ReplyModel.updateOne(
            {rid},
            {[isLikedReply ? '$pull' : '$addToSet']: {likes: uid}}
        )
        await UserModel.updateOne(
            {uid: reply.rUid},
            {$inc: {point: pointAmount, like: pointAmount}}
        )
        await createDeduplicatedMessage(
            uid,
            reply.rUid,
            'liked',
            reply.content.slice(0, 233),
            reply.tid,
            0
        )

        await session.commitTransaction()
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
}

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const {rid}: { rid: string } = await getQuery(event)
    if (!rid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const result = await updateReplyLike(userInfo.uid, Number(rid))
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return ReturnMessage.LikeReply
})