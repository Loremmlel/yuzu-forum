import {isValidTimestamp} from "~/utils/validate";
import {ErrorCode} from "~/error/errorCode";

export function checkReply(tags: string[], content: string, time: number): ErrorCode {
    if (tags.length > 7) {
        return ErrorCode.ReplyTagLimitExceeded
    }
    for (const tag of tags) {
        if (tag.length > 17) {
            return ErrorCode.ReplyTagTooLong
        }
    }

    if (!content.trim()) {
        return ErrorCode.EmptyReplyContent
    }
    if (content.length > 10007) {
        return ErrorCode.ReplyContentTooLong
    }
    if (!isValidTimestamp(time)) {
        return ErrorCode.InvalidTopicTimestamp
    }
    return ErrorCode.NoError
}