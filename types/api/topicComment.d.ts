import type {TopicUserInfo} from "~/types/api/topic";

export interface TopicComment {
    cid: number
    rid: number
    tid: number
    user: Omit<TopicUserInfo, 'point'>
    toUser: Omit<YzUser, 'avatar'>
    content: string
    likes: {
        count: number
        isLiked: boolean
    }
}

export interface TopicLikeCommentRequestData {
    cid: string
    toUid: string
}

export interface TopicCreateCommentRequestData {
    rid: number
    toUid: number
    content: string
}
