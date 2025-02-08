import type {TopicReply} from "~/types/api/topicReply";

interface ReplyDraft {
    toUid: number
    toUserName: string
    toFloor: number
    tags: string[]
    content: string
}

interface ReplyRewriteTemp {
    rid: number
    content: string
    tags: string[]
    edited: number
}

export interface ReplyStoreTemp {
    textCount: number
    isEdit: boolean
    isScrollToTop: boolean
    scrollToReplyId: number
    isReplyRewriting: boolean

    replyRewrite: TopicReply[]
    tempReply: TopicReply[]
}

export interface ReplyStorePersist {
    mode: 'preview' | 'code'
    textCount: number

    replyDraft: ReplyDraft
}