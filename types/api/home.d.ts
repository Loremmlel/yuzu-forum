import type {MessageType} from "~/types/api/message";
import type {GameResource} from "~/types/api/gameResource";

export interface HomeMessage {
    uid: number
    name: string
    tid: number
    gid: number
    type: MessageType
    content: string
    time: number
}

export interface HomeUserStatus {
    points: number
    isCheckIn: boolean
}

export interface HomePinnedTopic {
    tid: number
    title: string
    time: number
}

export interface HomeTopic {
    tid: number
    title: string
    views: number
    likes: number
    replies: number
    comments: number

    time: number
    tags: string[]
    section: string[]
    user: YuzuUser
    status: number
    upvoteTime: number
}

export interface HomeGame {
    gid: number
    name: YuzuLanguage
    time: number
    views: number
    contributors: YuzuUser[]
    languages: string[]
    platforms: string[]
}

export interface HomeGameResources extends GameResource {
    name: YuzuLanguage
    time: number
}