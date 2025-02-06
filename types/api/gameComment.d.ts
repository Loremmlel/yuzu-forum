export interface GameComment {
    gcid: number
    gid: number
    time: number
    content: string
    likes: {
        count: number
        isLiked: boolean
    }

    user: YzUser
    toUser: Omit<YzUser, 'avatar'> | 0
}