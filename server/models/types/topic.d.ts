import {User} from "~/server/models/types/user";

export interface Topic {
    tid: number
    title: string
    content: string
    uid: number
    avatar: string
    name: string
    tags: string[]
    category: string[]
    section: string[]
    time: number

    views: number
    upvoteTime: number

    upvotes: number[]
    replies: number[]
    likes: number[]
    share: number[]
    comments: number
    dislikes: number[]
    favorites: number[]

    status: number
    edited: number

    user: User[]

    created: Date
    updated: Date
}