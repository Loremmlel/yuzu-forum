import {Feed} from 'feed'

interface I18nContent {
    title: string
    description: string
    generator: string
    copyright: string
}

const contentMap: Record<Language, Record<'topic' | 'game', I18nContent>> = {
    'en-us': {
        topic: {
            title: 'Yuzu Game Forum - New Topics RSS',
            description: 'News and updates about Topics',
            generator: 'RSS generator',
            copyright: 'Copyright © 2024 Yuzu Game Forum All Rights Reserved'
        },
        game: {
            title: 'Yuzu Game Forum - New Game RSS',
            description: 'News and updates about games',
            generator: 'RSS generator',
            copyright: 'Copyright © 2024 Yuzu Game Forum All Rights Reserved'
        }
    },
    'ja-jp':{
        topic: {
            title: 'ゆずゲームフォーラム - 新着トピックRSS',
            description: 'トピックに関するニュースと更新情報',
            generator: 'RSSジェネレータ',
            copyright: '著作権 © 2024 ゆずゲームフォーラム すべての権利を保有'
        },
        game: {
            title: 'ゆずゲームフォーラム - 新着ゲームRSS',
            description: 'ゲームに関するニュースと更新情報',
            generator: 'RSSジェネレーター',
            copyright: '著作権 © 2024 ゆずゲームフォーラム すべての権利を保有'
        }
    },
    'zh-cn': {
        topic: {
            title: '柚子游戏论坛 - 新话题订阅',
            description: '最新更新关于游戏的话题',
            generator: 'RSS生成器',
            copyright: '版权所有 © 2025 柚子游戏 保留所有权利'
        },
        game: {
            title: '柚子游戏论坛 - 新游戏订阅',
            description: '最新更新的游戏',
            generator: 'RSS生成器',
            copyright: '版权所有 © 2025 柚子游戏 保留所有权利'
        }
    }
}

export const useYuzuFeed = (baseUrl: string, language: Language, link: 'topic' | 'game') => {
    const i18nUrl = `${baseUrl}/${language}`
    const rss = `${i18nUrl}/rss/${link}.xml?locale=${language}`

    const feedContent = contentMap[language][link]
    return new Feed({
        ...feedContent,
        id: i18nUrl,
        link: i18nUrl,
        language,
        image: `${i18nUrl}/yzforum.webp`,
        favicon: `${baseUrl}/favicon.ico`,
        feedLinks: {
            rss
        }
    })
}