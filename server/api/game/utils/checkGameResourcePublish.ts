import {GameResourceStoreTemp} from "~/store/types/game/resource";
import {languageOptions, platformOptions, typeOptions} from "~/components/game/utils/option";
import {isValidURL} from "~/utils/validate";
import {resourceSizePattern} from "~/utils/pattern";
import {ErrorCode} from "~/error/errorCode";

export function checkGameResourcePublish(link: GameResourceStoreTemp): ErrorCode {
    if (!typeOptions.filter((item) => item !== 'all').includes(link.type)) {
        return ErrorCode.InvalidResourceType
    }

    if (!link.link.length || link.link.length > 107) {
        return ErrorCode.ResourceLinkRequiredOrExceededMax
    }

    for (const l of link.link) {
        if (l.trim().length > 1007) {
            return ErrorCode.ResourceLinkTooLong
        }

        if (!isValidURL(l)) {
            return ErrorCode.InvalidLinkFormat
        }
    }

    if (
        !languageOptions.filter((item) => item !== 'all').includes(link.language)
    ) {
        return ErrorCode.InvalidResourceLanguage
    }

    if (
        !platformOptions.filter((item) => item !== 'all').includes(link.platform)
    ) {
        return ErrorCode.InvalidResourcePlatform
    }

    if (!resourceSizePattern.test(link.size)) {
        return ErrorCode.InvalidResourceSizeFormat
    }

    if (link.code.length > 1007) {
        return ErrorCode.ResourceCodeTooLong
    }

    if (link.password.length > 1007) {
        return ErrorCode.ResourcePasswordTooLong
    }

    if (link.note.length > 1007) {
        return ErrorCode.ResourceNoteTooLong
    }

    return ErrorCode.NoError
}