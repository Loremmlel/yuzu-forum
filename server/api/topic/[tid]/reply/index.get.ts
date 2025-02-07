import {CommentModel} from "~/server/models/comment";
import {UserModel} from "~/server/models/user";
import {TopicComment} from "~/types/api/topicComment";
import mongoose from "mongoose";
import {TopicModel} from "~/server/models/topic";
import {ReplyModel} from "~/server/models/reply";
import {TopicReply, TopicReplyRequestData} from "~/types/api/topicReply";
import {markdownToHtml} from "~/server/utils/markdown";

async function getComments(uid: number, rid: number) {
    const comment = await CommentModel.find({rid})
        .populate('cUser', 'uid avatar name', UserModel)
        .populate('toUser', 'uid, name', UserModel)
        .lean()

    return comment.map(comment => ({
        cid: comment.cid,
        rid: comment.rid,
        tid: comment.tid,
        user: {
            uid: comment.cUser[0].uid,
            avatar: comment.cUser[0].avatar,
            name: comment.cUser[0].name
        },
        toUser: {
            uid: comment.toUser[0].uid,
            name: comment.toUser[0].name
        },
        content: comment.content,
        likes: {
            count: comment.likes.length,
            isLiked: comment.likes.includes(uid)
        }
    }) as TopicComment)
}

async function getReplies(
    uid: number,
    tid: number,
    page: number,
    limit: number,
    sortOrder: YuzuOrder
) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const topicReplies = await TopicModel.findOne({tid}).lean()
        if (!topicReplies) {
            return 10506
        }
        const replyIds = topicReplies.replies
        const skip = (page - 1) * limit
        const replyDetails = await ReplyModel.find({rid: {$in: replyIds}})
            .sort({floor: sortOrder})
            .skip(skip)
            .limit(limit)
            .populate('rUser', 'uid avatar name point', UserModel)
            .populate('toUser', 'uid name', UserModel)
            .lean()
        const replies = await Promise.all(
            replyDetails.map(async (reply) => ({
                rid: reply.rid,
                tid: reply.tid,
                floor: reply.floor,
                toFloor: reply.toFloor,
                user: {
                    uid: reply.rUser[0].uid,
                    name: reply.rUser[0].name,
                    avatar: reply.rUser[0].avatar,
                    point: reply.rUser[0].point
                },
                toUser: {
                    uid: reply.toUser[0].uid,
                    name: reply.toUser[0].name
                },
                edited: reply.edited,
                content: await markdownToHtml(reply.content),
                markdown: reply.content,
                upvotes: {
                    count: reply.upvotes.length,
                    isUpvoted: reply.upvotes.includes(uid)
                },
                upvoteTime: reply.upvoteTime,
                likes: {
                    count: reply.likes.length,
                    isLiked: reply.likes.includes(uid)
                },
                dislikes: {
                    count: reply.dislikes.length,
                    isDisliked: reply.dislikes.includes(uid)
                },
                tags: reply.tags,
                time: reply.time,
                comment: await getComments(uid, reply.rid)
            }) as TopicReply)
        )
        await session.commitTransaction()
        return replies
    } catch (err) {
        await session.abortTransaction()
        throw err
    }finally {
        await session.endSession()
    }
}

export default defineEventHandler(async (event) => {
    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, 10210)
    }

    const { page, limit, sortOrder }: TopicReplyRequestData = await getQuery(event)
    if (!page || !limit || !sortOrder) {
        return yuzuError(event, 10507)
    }
    if (limit !== '30') {
        return yuzuError(event, 10209)
    }

    const userInfo = await getCookieTokenInfo(event)
    const result = await getReplies(
        userInfo?.uid ?? 0,
        parseInt(tid),
        parseInt(page),
        parseInt(limit),
        sortOrder
    )
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }
    return result
})