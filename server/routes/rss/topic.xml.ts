import {useYuzuFeed} from "~/server/routes/_useI18nFeed";
import {TopicRSS} from "~/types/api/rss";

export default defineEventHandler(async (event) => {
    const {locale}: { locale: Language } = await getQuery(event)
    const language = locale ?? 'zh-cn'

    const baseUrl = useRuntimeConfig().public.YZFORUM_URL
    const i18nUrl = `${baseUrl}/${language}`

    const feed = useYuzuFeed(baseUrl, language, 'topic')

    const topics = await $fetch<TopicRSS[]>(`/api/rss/topic?language=${language}`, {method: 'GET'})

    for (const topic of topics) {
        feed.addItem({
            link: `${i18nUrl}/topic/${topic.tid}`,
            title: topic.name,
            date: new Date(topic.time),
            description: topic.description,
            author: [
                {
                    name: topic.user.name,
                    link: `${i18nUrl}gamer/${topic.user.uid}/info`
                }
            ]
        })
    }
    appendHeader(event, 'Content-Type', 'application/xml')
    return feed.rss2()
})