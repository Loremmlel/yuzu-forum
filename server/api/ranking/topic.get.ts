import {RankingGetTopicsRequestData, RankingTopics, TopicSortFieldRanking} from "~/types/api/ranking";
import {TopicModel} from "~/server/models/topic";

async function getTopicRanking(
    page: number,
    limit: number,
    sortField: TopicSortFieldRanking,
    sortOrder: YuzuOrder
) {
    const skip = (page - 1) * limit

    const sortOptions: Record<string, 1 | -1> = {
        [sortField]: sortOrder === 'asc' ? 1 : -1
    }
    const numberFiled = ['views', 'comments']
    if (numberFiled.includes(sortField)) {
        const topics = await TopicModel.find()
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean()
        return topics.map(topic => ({
            tid: topic.tid,
            title: topic.title,
            field: topic[sortField] as number
        }) as RankingTopics)
    }
    return TopicModel.aggregate([
        {$unwind: `$${sortField}`},
        {
            $group: {
                _id: '$_id',
                tid: {$first: '$tid'},
                title: {$first: '$title'},
                [sortField]: {$sum: 1}
            }
        },
        {$sort: sortOptions},
        {$skip: skip},
        {$limit: limit},
        {
            $project: {
                _id: 0,
                tid: 1,
                title: 1,
                field: `$${sortField}`
            }
        }
    ]) as Promise<RankingTopics[]>
}

export default defineEventHandler(async (event) => {
    const {page, limit, sortField, sortOrder}: RankingGetTopicsRequestData = await getQuery(event)
    if (!page || !limit || !sortField || !sortOrder) {
        return yuzuError(event, 10507)
    }
    if (limit !== '30') {
        return yuzuError(event, 10209)
    }

    const rankingTopicCache = await useStorage('redis')
        .getItem<RankingTopics[]>(`ranking:topic:${page}:${limit}:${sortField}:${sortOrder}`)
    if (rankingTopicCache) {
        return rankingTopicCache
    }
    const topics = await getTopicRanking(Number(page), Number(limit), sortField, sortOrder)
    await useStorage('redis').setItem(
        `ranking:topic:${page}:${limit}:${sortField}:${sortOrder}`,
        topics,
        {ttl: 20 * 60})
    return topics
})