import {User} from "~/server/models/types/user";
import {GameStoreTemp} from "~/store/types/edit/game";

interface Difference {
    oldValue: unknown
    newValue: unknown
}

export interface GamePR {
    gprid: number
    gid: number
    uid: number
    status: number
    index: number
    note: string
    completedTime: number
    game: Partial<GameStoreTemp>

    user: User
}