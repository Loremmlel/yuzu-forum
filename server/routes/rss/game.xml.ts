import {useYuzuFeed} from "~/server/routes/_useI18nFeed";
import {GameRSS} from "~/types/api/rss";

export default defineEventHandler(async (event) => {
    const {locale}: { locale: Language } = await getQuery(event)
    const language = locale ?? 'zh-cn'

    const baseUrl = useRuntimeConfig().public.YZFORUM_URL
    const i18nUrl = `${baseUrl}/${language}`

    const feed = useYuzuFeed(baseUrl, language, 'game')
    const games = await $fetch<GameRSS[]>(`/api/rss/game?language=${language}`, {method: 'GET'})

    for (const game of games) {
        feed.addItem({
            link: `${i18nUrl}/game/${game.gid}`,
            image: game.banner,
            title: game.name,
            date: new Date(game.time),
            description: game.description,
            author: [{
                name: game.user.name,
                link: `${i18nUrl}gamer/${game.user.uid}/info`
            }]
        })
    }
    appendHeader(event, 'Content-Type', 'application/xml')
    return feed.rss2()
})