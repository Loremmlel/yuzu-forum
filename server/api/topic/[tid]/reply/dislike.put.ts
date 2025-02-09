import {ReplyModel} from "~/server/models/reply";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/code&message/errorCode";

async function updateReplyDislike(uid: number, rid: number) {
    const reply = await ReplyModel.findOne({rid})
    if (!reply) {
        return ErrorCode.ReplyNotFound
    }
    if (uid === reply.rUid) {
        return null
    }

    const isDislikedReply = reply.dislikes.includes(uid)
    const amount = isDislikedReply ? -1 : 1

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await ReplyModel.updateOne(
            {rid},
            {[isDislikedReply ? '$pull' : '$addToSet']: {dislikes: uid}}
        )
        await UserModel.updateOne(
            {uid: reply.rUid},
            {$inc: {dislike: amount}}
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

    const result = await updateReplyDislike(userInfo.uid, parseInt(rid))
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return '点踩回复成功!'
})