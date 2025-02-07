import mongoose from "mongoose";
import {TopicModel} from "~/server/models/topic";
import {updateTagsByTidAndRid} from "~/server/utils/tags";
import {checkTopic} from "~/server/api/topic/utils/checkTopic";
import {EditUpdateTopicRequestData} from "~/types/api/topic";

async function updateTopic(
    uid: number,
    tid: number,
    title: string,
    content: string,
    tags: string[],
    category: string[],
    section: string[],
    edited: number
) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await TopicModel.updateOne(
            { tid, uid },
            { title, content, tags, category, section, edited }
        )
        await updateTagsByTidAndRid(tid, 0, tags, category)
        await session.commitTransaction()
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        await session.endSession()
    }
}

export default defineEventHandler(async (event) => {
    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, 10210)
    }

    const {
        title,
        content,
        tags,
        category,
        section,
        edited
    }: EditUpdateTopicRequestData = await readBody(event)
    const res = checkTopic(
        title,
        content,
        tags,
        category,
        section,
        Number(edited)
    )
    if (res) {
        return yuzuError(event, res)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const uid = userInfo.uid

    await updateTopic(
        uid,
        Number(tid),
        title,
        content,
        tags,
        category,
        section,
        Number(edited)
    )

    return '修改主题成功!'
})