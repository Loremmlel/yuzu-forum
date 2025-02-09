import {isValidURL} from "~/utils/validate";
import {ErrorCode} from "~/code&message/errorCode";

export function checkGameLinkPublish(name: string, link: string): ErrorCode {
    if (name.trim().length > 107) {
        return ErrorCode.LinkNameTooLong
    }
    if (link.trim().length > 233) {
        return ErrorCode.LinkTooLong
    }
    if (!isValidURL(link)) {
        return ErrorCode.InvalidLinkFormat
    }

    return ErrorCode.NoError
}