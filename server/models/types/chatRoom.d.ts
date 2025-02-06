interface LastMessage {
    senderUid: number
    senderName: string
    content: string
    time: number
}

export interface ChatRoom {
    crid: number
    name: string
    type: 'private' | 'group'
    avatar: string
    participants: number[]
    admins: number[]
    lastMessage: LastMessage

    created: Date
    updated: Date
}