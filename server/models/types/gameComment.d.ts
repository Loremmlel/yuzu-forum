import {User} from "~/server/models/types/user";

export interface GameComment {
    gcid: number
    gid: number
    cUid: number
    toUid: number
    content: string

    likes: number[]

    cUser: User[]
    toUser?: User[]

    created: Date
    updated: Date
}