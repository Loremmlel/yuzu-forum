import {MessageStatus, MessageType} from "~/types/api/message";
import {User} from "~/server/models/types/user";

export interface Message {
    mid: number
    senderUid: number
    receiverUid: number
    time: number
    tid: number
    gid: number
    content: string
    status: MessageStatus
    user: User
    type: MessageType

    created: Date
    updated: Date
}