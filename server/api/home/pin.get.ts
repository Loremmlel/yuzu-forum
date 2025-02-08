import {HomePinnedTopic} from "~/types/api/home";
import {TopicModel} from "~/server/models/topic";

export default defineEventHandler(async (_) => {
    const homePinnedTopicCache= await useStorage('redis').getItem<HomePinnedTopic[]>(`home:pinned`)
    if (homePinnedTopicCache) {
        return homePinnedTopicCache
    }

    const topics = await TopicModel.find({ status: 2 }).lean()
    const data: HomePinnedTopic[] = topics.map((topic) => ({
        tid: topic.tid,
        title: topic.title,
        time: topic.time
    }))

    if (topics.length) {
        await useStorage('redis').setItem(`home:pinned`, data, {
            ttl: 60 * 60
        })
    }
    return topics
})