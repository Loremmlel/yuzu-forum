import {GameStoreTemp} from "~/store/types/edit/game";
import {isValidYzLanguage} from "~/utils/validate";

export function checkGamePR(game: GameStoreTemp) {
    if (typeof game.gid !== 'number' || game.gid > 1000000) {
        return
    }

    if (!isValidYzLanguage(game.name, 233)) {
        return 10603
    }

    if (!isValidYzLanguage(game.introduction, 100000)) {
        return 10606
    }

    if (game.alias.length > 20) {
        return 10611
    }

    for (const alias of game.alias) {
        if (alias.length > 500) {
            return 10612
        }
    }

    if (game.official.length > 20) {
        return 10637
    }

    for (const o of game.official) {
        if (o.trim().length > 233) {
            return 10629
        }
    }

    if (game.engine.length > 20) {
        return 10638
    }

    for (const e of game.engine) {
        if (e.trim().length > 100) {
            return 10635
        }
    }

    if (game.tags.length > 100) {
        return 10642
    }

    for (const t of game.tags) {
        if (t.trim().length > 50) {
            return 10643
        }
    }

    return 0
}