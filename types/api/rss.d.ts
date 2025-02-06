export interface GameRSS {
    gid: number
    name: string
    banner: string
    user: YuzuUser

    time: number
    description: string
}

export interface TopicRSS {
    tid: number
    name: string
    user: YuzuUser

    time: number
    description: string
}
