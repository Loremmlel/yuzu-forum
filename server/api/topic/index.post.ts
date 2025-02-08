import {H3Event} from "h3";
import {EditCreateTopicRequestData} from "~/types/api/topic";
import {checkTopic} from "~/server/api/topic/utils/checkTopic";
import {UserModel} from "~/server/models/user";
import mongoose from "mongoose";
import {TopicModel} from "~/server/models/topic";
import {createTagsByTidAndRid} from "~/server/utils/tags";
import {ErrorCode} from "~/error/errorCode";

async function readTopicData(event: H3Event) {
    const {
        title,
        content,
        time,
        tags,
        category,
        section
    }: EditCreateTopicRequestData = await readBody(event)
    const res = checkTopic(title, content, tags, category, section, Number(time))
    if (res !== ErrorCode.NoError) {
        return yuzuError(event, res)
    }
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const deduplicatedTags = [...new Set(tags)]
    return {
        title,
        content,
        time,
        tags: deduplicatedTags,
        category,
        section,
        uid
    }
}

export default defineEventHandler(async (event) => {
    const result = await readTopicData(event)
    if (!result) {
        return
    }
    const {
        title,
        content,
        time,
        tags,
        category,
        section,
        uid
    } = result
    const user = await UserModel.findOne({uid})
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    if (user.point / 10 < user.dailyTopicCount) {
        return yuzuError(event, ErrorCode.DailyTopicLimitExceeded)
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const newTopic = await TopicModel.create({
            title,
            content,
            time,
            tags,
            category,
            section,
            uid
        })
        await UserModel.updateOne(
            {uid},
            {
                $addToSet: {topic: newTopic.tid},
                $inc: {dailyTopicCount: 1}
            })
        await createTagsByTidAndRid(newTopic.tid, 0, tags, category)
        await session.commitTransaction()
        return newTopic.tid
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})