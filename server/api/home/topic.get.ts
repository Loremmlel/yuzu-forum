import {HomeTopic} from "~/types/api/home";
import {UserModel} from "~/server/models/user";
import {TopicModel} from "~/server/models/topic";
import {ErrorCode} from "~/error/errorCode";

async function getHomeTopics(page: number, limit: number) {
    const skip = (page - 1) * limit

    const topics = await TopicModel.find({ status: { $ne: 1 } })
        .sort({ time: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'uid avatar name', UserModel)
        .lean()

    return topics.map((topic) => ({
        tid: topic.tid,
        title: topic.title,
        views: topic.views,
        likes: topic.likes.length,
        replies: topic.replies.length,
        comments: topic.comments,
        time: topic.time,
        tags: topic.tags,
        section: topic.section,
        user: {
            uid: topic.user[0].uid,
            name: topic.user[0].name,
            avatar: topic.user[0].avatar
        },
        status: topic.status,
        upvoteTime: topic.upvoteTime
    }) as HomeTopic)
}

export default defineEventHandler(async (event) => {
    const { page, limit }: YuzuPagination = await getQuery(event)
    if (limit !== '10') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    return await getHomeTopics(Number(page), Number(limit))
})