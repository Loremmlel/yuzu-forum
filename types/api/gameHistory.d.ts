export type GameHistoryAction =
    'created'
    | 'updated'
    | 'deleted'
    | 'merged'
    | 'declined'
export type GameHistoryType = 'game' | 'banner' | 'link' | 'pr'

export interface CreateGameHistoryRequestData {
    gid: number
    uid: number
    time: number
    action: GameHistoryAction
    type: GameHistoryType
    content: string
}

export interface GameHistory {
    gid: number
    time: number
    action: GameHistoryAction
    type: GameHistoryType
    content: string
    user: YzUser
}