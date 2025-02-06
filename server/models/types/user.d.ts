export interface User {
    uid: number
    name: string
    email: string
    password: string
    ip: string
    avatar: string
    roles: number
    status: number
    time: number
    point: number
    bio: string
    upvote: number
    like: number
    dislike: number

    dailyTopicCount: number
    dailyGameCount: number
    dailyImageCount: number
    dailyCheckIn: number

    friend: number[]
    followed: number[]
    follower: number[]
    reply: number[]
    comment: number[]

    topic: number[]
    likeTopic: number[]
    dislikeTopic: number[]
    upvoteTopic: number[]
    favoriteTopic: number[]

    game: number[]
    likeGame: number[]
    favoriteGame: number[]
    contributeGame: number[]

    gameResource: number[]
    likeGameResource: number[]

    created: Date
    updated: Date
}