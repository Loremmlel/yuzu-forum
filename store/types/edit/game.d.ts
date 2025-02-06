export interface GameStorePersist {
    vndbId: string
    name: YzLanguage
    introduction: YzLanguage
    aliases: string[]
}

export interface GameStoreTemp{
    gid: number
    name: YzLanguage
    introduction: YzLanguage
    series: string[]
    aliases: string[]
    official: string[]
    engine: string[]
    tags: string[]
}