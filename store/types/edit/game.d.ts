export interface GameStorePersist {
    vndbId: string
    name: YuzuLanguage
    introduction: YuzuLanguage
    aliases: string[]
}

export interface GameStoreTemp {
    gid: number
    name: YuzuLanguage
    introduction: YuzuLanguage
    series: string[]
    aliases: string[]
    official: string[]
    engine: string[]
    tags: string[]
}