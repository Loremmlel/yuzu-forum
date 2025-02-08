import {ErrorCode} from "~/error/errorCode";

export function checkComment(content: string): ErrorCode {
    if (!content.trim() || content.trim().length > 1000) {
        return ErrorCode.CommentContentTooLongOrEmpty
    }
    return ErrorCode.NoError
}