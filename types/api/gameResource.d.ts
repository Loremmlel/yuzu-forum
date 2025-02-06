export interface GameResource {
    gid: number
    grid: number
    uid: number
    type: string
    language: string
    platform: string
    size: string
    time: number
    status: number
    likes: number[]
}

export interface GameResourceDetails extends GameResource {
    user: YuzuUser
    link: string[]
    code: string
    password: string
    note: string
}