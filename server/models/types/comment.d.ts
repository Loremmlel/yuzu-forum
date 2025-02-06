import {Topic} from "~/server/models/types/topic";
import {User} from "~/server/models/types/user";

export interface Comment {
    cid: number
    rid: number
    tid: number
    cUid: number
    toUid: number
    content: string

    likes: number[]

    topic: Topic[]
    cUser: User[]
    toUser: User[]

    created: Date
    updated: Date
}