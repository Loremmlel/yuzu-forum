export interface GameComment {
    gcid: number
    gid: number
    time: number
    content: string
    likes: {
        count: number
        isLiked: boolean
    }

    user: YuzuUser
    toUser: Omit<YuzuUser, 'avatar'> | 0
}