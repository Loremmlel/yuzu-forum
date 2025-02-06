import {User} from "~/server/models/types/user";

export interface MessageRead {
    uid: number
    readTime: number
}

export interface MessageReaction {
    uid: number
    reaction: string
}

export interface ChatMessage {
    cmid: number
    chatroomName: string
    senderUid: number
    receiverUid: number
    content: string
    toUid: number
    time: number
    status: 'pending' | 'sent' | 'read'
    isRecalled: boolean
    recalledTime: number
    readBy: MessageRead[]
    reactions: MessageReaction[]

    user: User[]

    created: Date
    updated: Date
}