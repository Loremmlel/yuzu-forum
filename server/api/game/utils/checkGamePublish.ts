import {isValidYzLanguage} from "~/utils/validate";
import {ErrorCode} from "~/code&message/errorCode";

export function checkGamePublish(
    vndbId: string,
    name: YuzuLanguage,
    introduction: YuzuLanguage,
    aliases?: string[]
): ErrorCode {
    if (!vndbId.trim()) {
        return ErrorCode.VNDBIdRequired
    }
    if (!isValidYzLanguage(name, 233)) {
        return ErrorCode.InvalidTitleLength
    }
    if (!isValidYzLanguage(introduction, 100007)) {
        return ErrorCode.InvalidDescriptionLength
    }
    if (!aliases) {
        return ErrorCode.NoError
    }
    if (aliases.length > 17) {
        return ErrorCode.AliasCountExceeded
    }
    for (const alias of aliases) {
        if (alias.length > 500) {
            return ErrorCode.AliasTooLong
        }
    }
    return ErrorCode.NoError
}