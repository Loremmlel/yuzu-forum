import {TopicModel} from "~/server/models/topic";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {createDeduplicatedMessage} from "~/server/utils/message";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

async function updateTopicLike(uid: number, tid: number) {
    const topic = await TopicModel.findOne({tid})
    if (!topic) {
        return ErrorCode.TopicNotFound
    }
    if (uid === topic.uid) {
        return null
    }
    const isLikedTopic = topic.likes.includes(uid)
    const pointAmount = isLikedTopic ? -1 : 1

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await TopicModel.updateOne(
            {tid},
            {[isLikedTopic ? '$pull' : '$addToSet']: {likes: uid}}
        )
        await UserModel.updateOne(
            {uid},
            {[isLikedTopic ? '$pull' : '$addToSet']: {likeTopic: tid}}
        )
        await UserModel.updateOne(
            {uid: topic.uid},
            {$inc: {point: pointAmount, like: pointAmount}}
        )
        if (!isLikedTopic) {
            await createDeduplicatedMessage(
                uid,
                topic.uid,
                'liked',
                topic?.content.slice(0, 233) ?? '',
                tid,
                0
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
    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, ErrorCode.TopicIdReadFailed)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const result = await updateTopicLike(userInfo.uid, Number(tid))
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return ReturnMessage.LikeTopic
})