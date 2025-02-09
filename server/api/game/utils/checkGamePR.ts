import {GameStoreTemp} from "~/store/types/edit/game";
import {isValidYzLanguage} from "~/utils/validate";
import {ErrorCode} from "~/code&message/errorCode";

export function checkGamePR(game: GameStoreTemp): ErrorCode {
    if (typeof game.gid !== 'number' || game.gid > 1000000) {
        return ErrorCode.InvalidGameGID
    }

    if (!isValidYzLanguage(game.name, 233)) {
        return ErrorCode.InvalidTitleLength
    }

    if (!isValidYzLanguage(game.introduction, 100007)) {
        return ErrorCode.InvalidDescriptionLength
    }

    if (game.alias.length > 17) {
        return ErrorCode.AliasCountExceeded
    }

    for (const alias of game.alias) {
        if (alias.length > 500) {
            return ErrorCode.AliasTooLong
        }
    }

    if (game.official.length > 17) {
        return ErrorCode.OfficialWebsiteLimitExceeded
    }

    for (const o of game.official) {
        if (o.trim().length > 233) {
            return ErrorCode.OfficialLinkTooLong
        }
    }

    if (game.engine.length > 17) {
        return ErrorCode.EngineCountExceeded
    }

    for (const e of game.engine) {
        if (e.trim().length > 107) {
            return ErrorCode.EngineNameTooLong
        }
    }

    if (game.tags.length > 107) {
        return ErrorCode.TagCountExceeded
    }

    for (const t of game.tags) {
        if (t.trim().length > 50) {
            return ErrorCode.TagNameTooLong
        }
    }

    return ErrorCode.NoError
}