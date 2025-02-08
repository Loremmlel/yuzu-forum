export interface MessageHistoryRequest {
    receiverUid: string
    page: string
    limit: string
}

export interface AsideItem {
    chatroomName: string
    content: string
    time: number
    count: number
    unreadCount: number
    route: string
    title: string
    avatar: string
}

export interface Message {
    cmid: number
    chatroomName: string
    sender: YuzuUser
    receiverUid: number
    content: string
    time: number
    status: string
}