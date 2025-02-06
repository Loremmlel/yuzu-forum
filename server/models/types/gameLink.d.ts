import {User} from "~/server/models/types/user";

export interface GameLink {
    glid: number
    gid: number
    uid: number
    name: string
    link: string

    user: User[]

    created: Date
    updated: Date
}