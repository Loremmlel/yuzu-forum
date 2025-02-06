export interface Banned {
    bid: number
    uid: number
    name: string
    description: YuzuLanguage
    time: number
    result: string | number

    created: Date
    updated: Date
}