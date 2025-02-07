import {Topic} from "~/server/models/types/topic";
import {User} from "~/server/models/types/user";

export interface Reply {
    rid: number
    tid: number
    rUid: number
    toUid: number
    floor: number
    toFloor: number
    tags: string[]
    time: number
    edited: number
    content: string
    upvoteTime: number

    upvotes: number[]
    likes: number[]
    dislikes: number[]
    share: number[]
    comment: number[]

    topic: Topic[]
    rUser: User[]
    toUser: User[]

    created: Date
    updated: Date
}