import type {HomeGame, HomeTopic} from "~/types/api/home";

export type SearchResultTopic = HomeTopic
export type SearchResultGalgame = HomeGame

export interface SearchResultUser {
    uid: number
    name: string
    avatar: string
    bio: string
    point: number
    time: number
}

export interface SearchResultReply {
    tid: number
    title: string
    content: string
    user: YzUser
    toUser: YzUser
    time: number
}

export interface SearchResultComment {
    tid: number
    title: string
    content: string
    user: YzUser
    toUser: YzUser
    time: number
}

export type SearchType = 'topic' | 'galgame' | 'user' | 'reply' | 'comment'
export type SearchResult =
    | SearchResultTopic
    | SearchResultGalgame
    | SearchResultUser
    | SearchResultReply
    | SearchResultComment

export interface SearchRequestData {
    keywords: string
    type: SearchType
    page: string
    limit: string
}