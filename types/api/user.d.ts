export type TopicType = 'publish' | 'like' | 'upvote' | 'favorite'
export type GameType = 'publish' | 'like' | 'favorite' | 'contribute'

export interface UserInfo {
    uid: number
    name: string
    avatar: string
    roles: number
    status: number
    time: number
    point: number
    bio: string
    upvote: number
    like: number
    dislike: number

    reply: number
    comment: number

    topic: number
    likeTopic: number
    upvoteTopic: number
    favoriteTopic: number

    Game: number
    likeGame: number
    favoriteGame: number
    contributeGame: number

    dailyTopicCount: number
    dailyGameCount: number
}

export interface UserUpdateAvatarRequestData {
    uid: number
    avatar: FormData
}

export interface UserUpdateBioRequestData {
    uid: number
    bio: string
}

export interface UserUpdateEmailRequestData {
    email: string
    code: string
}

export interface UserUpdatePasswordRequestData {
    oldPassword: string
    newPassword: string
}

export interface UserTopic {
    tid: number
    title: string
    time: number
}

export interface UserGetTopicRequestData {
    page: string
    limit: string
    type: TopicType
}

export interface UserGame {
    gid: number
    name: YuzuLanguage
    time: number
}

export interface UserGetGameRequestData {
    page: string
    limit: string
    type: GameType
}

export interface UserReply {
    tid: number
    content: string
    time: number
}

export interface UserGetUserReplyRequestData {
    uid: number
    ridArray: number[]
}

export interface UserComment {
    tid: number
    content: string
}

export interface UserGetUserCommentRequestData {
    uid: number
    cidArray: number[]
}

export interface LoginRequestData {
    name: string
    password: string
}

export interface RegisterRequestData {
    name: string
    email: string
    password: string
    code: string
}

export type UserUpdateAvatarResponseData = {
    avatar: string
    avatarMin: string
}

export type UserGetUserEmailResponseData = {
    email: string
}

export type LoginResponseData = {
    uid: number
    name: string
    avatar: string
    point: number
    roles: number
    token: string
}
