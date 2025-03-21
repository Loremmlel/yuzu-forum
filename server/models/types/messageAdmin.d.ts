import {User} from "~/server/models/types/user";

export type MessageStatus = 'read' | 'unread'

export interface Message {
    maid: number
    uid: number
    time: number
    content: YuzuLanguage
    status: MessageStatus

    user: User[]

    created: Date
    updated: Date
}