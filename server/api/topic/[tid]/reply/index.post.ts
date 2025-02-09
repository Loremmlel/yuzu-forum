import {H3Event} from "h3";
import {TopicCreateReplyRequestData, TopicReply} from "~/types/api/topicReply";
import {checkReply} from "~/server/api/topic/utils/checkReply";
import mongoose from "mongoose";
import {ReplyModel} from "~/server/models/reply";
import {UserModel} from "~/server/models/user";
import {TopicModel} from "~/server/models/topic";
import {createTagsByTidAndRid} from "~/server/utils/tags";
import {createMessage} from "~/server/utils/message";
import {markdownToHtml} from "~/server/utils/markdown";
import {ErrorCode} from "~/code&message/errorCode";

async function readReply(event: H3Event) {
    const {
        toUid,
        toFloor,
        tags,
        content,
        time
    }: TopicCreateReplyRequestData = await readBody(event)

    const res = checkReply(tags, content, time)
    if (res !== ErrorCode.NoError) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, ErrorCode.TopicIdReadFailed)
    }

    const deduplicatedTags = [...new Set(tags)]
    return {
        tid: Number(tid),
        uid: userInfo.uid,
        toUid,
        toFloor,
        tags: deduplicatedTags,
        content,
        time
    }
}

export default defineEventHandler(async (event) => {
    const result = await readReply(event)
    if (!result) {
        return
    }
    const {tid, uid, toUid, toFloor, tags, content, time} = result

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const maxFloorReply = await ReplyModel.findOne({tid})
            .sort('-floor')
            .lean()
        const baseFloor = maxFloorReply ? maxFloorReply.floor : 0
        const floor = baseFloor + 1

        const newReply = await ReplyModel.create({
            tid,
            rUid: uid,
            toUid,
            toFloor,
            floor,
            tags,
            content,
            time
        })
        const user = await UserModel.findOneAndUpdate(
            {uid: newReply.rUid},
            {$addToSet: {reply: newReply.rid}}
        )
        const toUser = await UserModel.findOne({uid: newReply.toUid})

        await TopicModel.updateOne(
            {tid},
            {
                $addToSet: {replies: newReply.rid},
                $set: {time: Date.now()}
            }
        )

        if (tags.length) {
            await createTagsByTidAndRid(tid, newReply.rid, tags, [])
        }
        if (uid !== toUid) {
            await UserModel.updateOne(
                {uid: newReply.toUid},
                {$inc: {point: 2}}
            )
            await createMessage(
                uid,
                toUid,
                'replied',
                newReply.content.slice(0, 233),
                tid,
                0
            )
        }
        const response: TopicReply = {
            rid: newReply.rid,
            tid: newReply.tid,
            floor: newReply.floor,
            toFloor: newReply.toFloor,
            user: {
                uid: user!.uid,
                name: user!.name,
                avatar: user!.avatar,
                point: user!.point
            },
            toUser: {
                uid: toUser!.uid,
                name: toUser!.name
            },
            edited: newReply.edited,
            content: await markdownToHtml(newReply.content),
            markdown: newReply.content,
            upvotes: {
                count: 0,
                isUpvoted: false
            },
            upvoteTime: newReply.upvoteTime,
            likes: {
                count: 0,
                isLiked: false
            },
            dislikes: {
                count: 0,
                isDisliked: false
            },
            tags: [],
            time: newReply.time,
            comment: []
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