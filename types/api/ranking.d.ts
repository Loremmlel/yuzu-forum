type TopicSortFieldRanking =
    | 'views'
    | 'upvotes'
    | 'likes'
    | 'replies'
    | 'comments'

type UserSortFieldRanking =
    | 'point'
    | 'upvote'
    | 'like'
    | 'topic'
    | 'reply'
    | 'comment'

export interface RankingGetTopicsRequestData {
    page: string
    limit: string
    sortField: TopicSortFieldRanking
    sortOrder: YzOrder
}

export interface RankingTopics {
    tid: number
    title: string
    field: number
}

export interface RankingGetUserRequestData {
    page: string
    limit: string
    sortField: UserSortFieldRanking
    sortOrder: YzOrder
}

export interface RankingUsers {
    uid: number
    name: string
    avatar: string
    field: number
}
