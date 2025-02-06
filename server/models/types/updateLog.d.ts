export interface UpdateLog {
    upid: number
    type: string
    content: YuzuLanguage
    time: string
    version: string

    created: Date
    updated: Date
}