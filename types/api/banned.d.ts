export interface BannedLogRequestData {
    page: string
    limit: string
    language: Language
}

export interface BannedLog {
    nid: number
    uid: number
    name: string
    description: YuzuLanguage
    time: number
    result: string | number
}
