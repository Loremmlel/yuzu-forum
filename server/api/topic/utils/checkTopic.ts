import {gameSection, otherSection, techniqueSection} from "~/components/edit/utils/category";
import {isValidTimestamp} from '~/utils/validate'

const topicCategory = ['game', 'technique', 'other']
const topicSection = [...gameSection, ...techniqueSection, ...otherSection]

export function checkTopic(
    title: string,
    content: string,
    tags: string[],
    category: string[],
    section: string[],
    edited: number
) {
    if (!title.trim() || title.trim().length > 47) {
        return 10204
    }
    if (!content.trim() || content.trim().length > 100000) {
        return 10205
    }
    if (!tags.length || tags.length > 7) {
        return 10206
    }
    for (const tag of tags) {
        if (tag.length > 20) {
            return 10502
        }
    }
    if (!category.length || category.length > 2) {
        return 10207
    }
    for (const c of category) {
        if (!topicCategory.includes(c)) {
            return 10218
        }
    }

    if (!section.length || section.length > 2) {
        return 10219
    }
    for (const s of section) {
        if (!topicSection.includes(s)) {
            return 10222
        }
    }
    if (!isValidTimestamp(edited)) {
        return 10208
    }
    return 0
}