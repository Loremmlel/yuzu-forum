import {gameSection, otherSection, techniqueSection} from "~/components/edit/utils/category";
import {isValidTimestamp} from '~/utils/validate'
import {ErrorCode} from "~/error/errorCode";

const topicCategory = ['game', 'technique', 'other']
const topicSection = [...gameSection, ...techniqueSection, ...otherSection]

export function checkTopic(
    title: string,
    content: string,
    tags: string[],
    category: string[],
    section: string[],
    edited: number
): ErrorCode {
    if (!title.trim() || title.trim().length > 47) {
        return ErrorCode.TopicTitleTooLongOrEmpty
    }
    if (!content.trim() || content.trim().length > 100000) {
        return ErrorCode.TopicContentTooLongOrEmpty
    }
    if (!tags.length || tags.length > 7) {
        return ErrorCode.InvalidTagCount
    }
    for (const tag of tags) {
        if (tag.length > 20) {
            return ErrorCode.ReplyTagTooLong
        }
    }
    if (!category.length || category.length > 2) {
        return ErrorCode.InvalidCategoryCount
    }
    for (const c of category) {
        if (!topicCategory.includes(c)) {
            return ErrorCode.InvalidCategorySelection
        }
    }

    if (!section.length || section.length > 2) {
        return ErrorCode.InvalidSectionCount
    }
    for (const s of section) {
        if (!topicSection.includes(s)) {
            return ErrorCode.InvalidTopicSection
        }
    }
    if (!isValidTimestamp(edited)) {
        return ErrorCode.InvalidTopicTimestamp
    }
    return ErrorCode.NoError
}