import {User} from "~/server/models/types/user";
import {Game} from "~/server/models/types/game";

export interface GameResource {
    grid: number
    gid: number
    uid: number
    type: string
    link: string[]
    language: string
    platform: string
    size: string

    code: string
    password: string
    note: string
    time: number
    status: number
    likes: number[]

    user: User[]
    game: Game[]

    created: Date
    updated: Date
}