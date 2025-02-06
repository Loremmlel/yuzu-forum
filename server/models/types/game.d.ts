import {User} from "~/server/models/types/user";

export interface Game {
    gid: number
    vndbId: string
    uid: number
    name: YuzuLanguage
    banner: string
    introduction: YuzuLanguage

    time: number
    status: number
    views: number
    type: string[]
    language: string[]
    platform: string[]
    contributor: number[]
    likes: number[]
    favorites: number[]

    series: number[]
    resources: number[]
    links: number[]
    histories: number[]
    comments: number[]

    alias: string[]
    official: string[]
    engine: string[]
    tags: string[]

    user: User[]

    created: Date
    updated: Date
}