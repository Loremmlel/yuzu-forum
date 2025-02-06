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
    sortOrder: YzOrder
}

export interface Message {
    mid: number
    sender: YzUser
    receiverId: number
    time: number
    tid: number
    gid: number
    content: string
    status: MessageStatus
    type: MessageType
}