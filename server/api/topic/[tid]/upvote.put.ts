import {UserModel} from "~/server/models/user";
import {TopicModel} from "~/server/models/topic";
import mongoose from "mongoose";
import {createMessage} from "~/server/utils/message";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

async function updateTopicUpvote(uid: number, tid: number) {
    const topic = await TopicModel.findOne({tid})
    if (!topic) {
        return ErrorCode.TopicNotFound
    }
    const userInfo = await UserModel.findOne({uid})
    if (!userInfo) {
        return ErrorCode.LoginExpired
    }

    const point = userInfo.point
    if (point < 1100) {
        return ErrorCode.InsufficientPointsForPushTopic
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await TopicModel.updateOne(
            {tid},
            {
                $set: {upvoteTime: Date.now()},
                $push: {upvotes: uid}
            }
        )
        await UserModel.updateOne(
            {uid},
            {
                $inc: {point: -7},
                $addToSet: {upvoteTopic: tid}
            }
        )
        await UserModel.updateOne(
            {uid: topic.uid},
            {$inc: {point: 3, upvote: 1}}
        )

        await createMessage(
            uid,
            topic.uid,
            'upvoted',
            topic.content.slice(0, 233),
            tid,
            0
        )
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
    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, ErrorCode.TopicIdReadFailed)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const result = await updateTopicUpvote(userInfo.uid, parseInt(tid))
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }
    return ReturnMessage.UpvoteTopic
})