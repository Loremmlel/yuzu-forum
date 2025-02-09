import mongoose from "mongoose";
import {ReplyModel} from "~/server/models/reply";
import {updateTagsByTidAndRid} from "~/server/utils/tags";
import {TopicUpdateReplyRequestData} from "~/types/api/topicReply";
import {checkReply} from "~/server/api/topic/utils/checkReply";
import {ErrorCode} from "~/error/errorCode";

async function updateReply(
    uid: number,
    tid: number,
    rid: number,
    content: string,
    tags: string[],
    edited: number
) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await ReplyModel.updateOne(
            {rid, rUid: uid},
            {tags, edited, content}
        )
        await updateTagsByTidAndRid(tid, rid, tags, [])
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

    const {rid, content, tags, edited}: TopicUpdateReplyRequestData = await readBody(event)
    const result = checkReply(tags, content, edited)
    if (result !== ErrorCode.NoError) {
        return yuzuError(event, result)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid
    await updateReply(uid, Number(tid), rid, content, tags, edited)

    return '修改评论成功!'
})