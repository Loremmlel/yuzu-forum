import {ErrorCode} from "~/code&message/errorCode";

export function checkComment(content: string): ErrorCode {
    if (!content.trim() || content.trim().length > 1007) {
        return ErrorCode.CommentContentTooLongOrEmpty
    }
    return ErrorCode.NoError
}