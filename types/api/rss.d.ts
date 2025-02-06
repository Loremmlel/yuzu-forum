export interface GameRSS {
    gid: number
    name: string
    banner: string
    user: YzUser

    time: number
    description: string
}

export interface TopicRSS {
    tid: number
    name: string
    user: YzUser

    time: number
    description: string
}
