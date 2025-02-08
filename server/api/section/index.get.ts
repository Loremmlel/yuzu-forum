import {TopicModel} from "~/server/models/topic";
import {UserModel} from "~/server/models/user";
import {GetSectionRequestData, SectionTopic} from "~/types/api/section";
import {yuzuError} from "~/server/utils/YuzuError";
import {ErrorCode} from "~/error/errorCode";

async function getSectionTopic(section: string, page: number, limit: number, order: YuzuOrder) {
    const skip = (page - 1) * limit

    const totalCount = await TopicModel.countDocuments({
        status: {$ne: 1},
        section: {$in: section}
    })

    const data = await TopicModel.find({
        status: {$ne: 1},
        section: {$in: section}
    })
        .sort({time: order})
        .skip(skip)
        .limit(limit)
        .populate('user', 'uid avatar name', UserModel)
        .lean()

    const topics: SectionTopic[] = data.map(topic => ({
        tid: topic.tid,
        title: topic.title,
        content: topic.content.slice(0, 233),
        time: topic.time,
        tags: topic.tags,
        views: topic.views,
        likes: topic.likes.length,
        replies: topic.replies.length,
        user: {
            uid: topic.user[0].uid,
            avatar: topic.user[0].avatar,
            name: topic.user[0].name
        }
    }) as SectionTopic)

    return {totalCount, topics}
}

export default defineEventHandler(async (event) => {
    const {section, page, limit, order}: GetSectionRequestData = await getQuery(event)
    if (!section || !page || !limit || !order) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (limit !== '23') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }

    return await getSectionTopic(section, Number(page), Number(limit), order)

})