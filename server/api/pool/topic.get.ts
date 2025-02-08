import {PoolTopic, PoolTopicsRequestData, SortFieldPool} from "~/types/api/pool";
import {TopicModel} from "~/server/models/topic";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/error/errorCode";

async function getPoolTopics(
    page: number,
    limit: number,
    sortField: SortFieldPool,
    sortOrder: YuzuOrder,
    category: string
) {
    const skip = (page - 1) * limit

    const query = {
        status: {$ne: 1},
        ...(category !== 'all' ? {category: {$elemMatch: {$eq: category}}} : {})
    }
    const sortOptions: Record<string, YuzuOrder> = {
        // 虽然有ts的类型检查，但防御性编程
        [sortField]: sortOrder === 'asc' ? 'asc' : 'desc'
    }

    const topics = await TopicModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('user', 'uid avatar name', UserModel)
        .lean()

    return topics.map(topic => ({
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
            avatar: topic.user[0].avatar,
            name: topic.user[0].name
        },
        status: topic.status,
        upvoteTime: topic.upvoteTime
    }) as PoolTopic)
}

export default defineEventHandler(async (event) => {
    const {page, limit, sortField, sortOrder, category}: PoolTopicsRequestData = await getQuery(event)
    if (!page || !limit || !sortField || !sortOrder || !category) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    const availableCategory = ['all', 'game', 'technique', 'other']
    if (!availableCategory.includes(category)) {
        return yuzuError(event, 10220)
    }
    if (limit !== '24') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    return getPoolTopics(
        Number(page),
        Number(limit),
        sortField as SortFieldPool,
        sortOrder as YuzuOrder,
        category
    )
})