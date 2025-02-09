import {TopicModel} from "~/server/models/topic";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/code&message/errorCode";

async function updateTopicDislike(uid: number, tid: number) {
    const topic = await TopicModel.findOne({tid})
    if (!topic) {
        return ErrorCode.TopicNotFound
    }
    if (uid === topic.uid) {
        return
    }

    const isDislike = topic.dislikes.includes(uid)
    const amount = isDislike ? -1 : 1

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await TopicModel.updateOne(
            {tid},
            {[isDislike ? '$pull' : '$addToSet']: {dislikes: uid}}
        )
        await UserModel.updateOne(
            {uid},
            {[isDislike ? '$pull' : '$addToSet']: {dislikeTopic: tid}}
        )
        await UserModel.updateOne(
            {uid: topic.uid},
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
    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, ErrorCode.TopicIdReadFailed)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const result = await updateTopicDislike(userInfo.uid, Number(tid))
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }
    return '点踩主题成功!'
})