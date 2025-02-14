export interface GameContributor {
    uid: number
    avatar: string
}

export interface GameDetail {
    gid: number
    vndbId: string
    user: YuzuUser
    name: YuzuLanguage
    banner: string
    introduction: YuzuLanguage
    markdown: YuzuLanguage
    time: number
    views: number
    platform: string[]
    language: string[]
    contributor: GameContributor[]
    likes: {
        count: number
        isLiked: boolean
    }
    favorites: {
        count: number
        isFavorite: boolean
    }
    alias: string[]
    official: string[]
    tags: string[]
    series: number[]
}

export interface GamePageRequestData {
    page: string
    limit: string
    type: TypeOptions
    language: LanguageOptions
    platform: PlatformOptions
    sortField: 'time' | 'views'
    sortOrder: YuzuOrder
}

export interface GameCard {
    gid: number
    name: YuzuLanguage
    banner: string
    user: YuzuUser

    views: number
    likes: number
    time: number
    platform: string[]
    language: string[]
}
