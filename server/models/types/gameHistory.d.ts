import {User} from "~/server/models/types/user";

export interface GameHistory {
    ghid: number
    gid: number
    uid: number
    time: number
    action: string
    type: string
    content: string

    user: User

    created: Date
    updated: Date
}