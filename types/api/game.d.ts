export interface GameContributor {
    uid: number
    avatar: string
}

export interface GameDetail {
    gid: number
    vndbId: string
    user: YzUser
    name: YzLanguage
    banner: string
    introduction: YzLanguage
    markdown: YzLanguage
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
    engine: string[]
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
    sortOrder: YzOrder
}

export interface GameCard {
    gid: number
    name: YzLanguage
    banner: string
    user: YzUser

    views: number
    likes: number
    time: number
    platform: string[]
    language: string[]
}
