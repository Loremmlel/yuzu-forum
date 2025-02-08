export type MessageType =
    'upvoted'
    | 'liked'
    | 'favorite'
    | 'replied'
    | 'commented'
    | 'expired'
    | 'requested'
    | 'merged'
    | 'declined'
    | 'mentioned'
    | 'admin'

export type MessageStatus = 'read' | 'unread'

export type SortField = 'time'

export interface MessageRequestData {
    page: string
    limit: string
    type?: MessageType | ''
    sortField?: SortField
    sortOrder: YuzuOrder
}

export interface Message {
    mid: number
    sender: YuzuUser
    receiverUid: number
    time: number
    tid: number
    gid: number
    content: string
    status: MessageStatus
    type: MessageType
}