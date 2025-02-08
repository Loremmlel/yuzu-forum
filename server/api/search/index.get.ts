import {SearchRequestData, SearchType} from "~/types/api/search";
import {searchComment, searchGame, searchReply, searchTopic, searchUser} from "~/server/api/search/_search";
import {ErrorCode} from "~/error/errorCode";

async function search(keywords: string, type: SearchType, page: number, limit: number) {
    const skip = (page - 1) * limit
    const keywordsArray: string[] = keywords
        .trim()
        .slice(0, 40)
        .split(' ')
        .filter(keyword => keyword.trim() !== '')
    const escapedKeywords = keywordsArray.map(keyword =>
        keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )
    switch (type) {
        case 'topic':
            return await searchTopic(escapedKeywords, skip, limit)
        case 'game':
            return await searchGame(escapedKeywords, skip, limit)
        case 'user':
            return await searchUser(escapedKeywords.join(''), skip, limit)
        case 'reply':
            return await searchReply(escapedKeywords.join(''), skip, limit)
        case "comment":
            return await searchComment(escapedKeywords.join(''), skip, limit)
    }
}

export default defineEventHandler(async (event) => {
    const {keywords, type, page, limit}: SearchRequestData = await getQuery(event)
    if (limit !== '10') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    return await search(keywords, type, Number(page), Number(limit))
})