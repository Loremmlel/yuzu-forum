import type {HomeGame, HomeTopic} from "~/types/api/home";

export type SearchResultTopic = HomeTopic
export type SearchResultGame = HomeGame

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
    user: YuzuUser
    toUser: YuzuUser
    time: number
}

export interface SearchResultComment {
    tid: number
    title: string
    content: string
    user: YuzuUser
    toUser: YuzuUser
    time: number
}

export type SearchType = 'topic' | 'game' | 'user' | 'reply' | 'comment'
export type SearchResult =
    | SearchResultTopic
    | SearchResultGame
    | SearchResultUser
    | SearchResultReply
    | SearchResultComment

export interface SearchRequestData {
    keywords: string
    type: SearchType
    page: string
    limit: string
}