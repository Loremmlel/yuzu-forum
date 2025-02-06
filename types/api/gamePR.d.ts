import type {GameStoreTemp} from "~/store/types/edit/game";

export interface GamePR {
    gprid: number
    gid: number
    index: number
    status: number
    time: Date | number
    completedTime: number
    user: YzUser
}

export interface GamePRDetails extends GamePR {
    game: Partial<GameStoreTemp>
}