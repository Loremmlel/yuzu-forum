import {UserGetTopicRequestData, UserTopic} from "~/types/api/user";
import {UserModel} from "~/server/models/user";
import {TopicModel} from "~/server/models/topic";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const uid = getRouterParam(event, 'uid')
    if (!uid) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    const { page, limit, type }: UserGetTopicRequestData = await getQuery(event)
    if (!page || !limit || !type) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (limit !== '50') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const user = await UserModel.findOne({ uid }).lean()
    if (!user) {
        return yuzuError(event, ErrorCode.InvalidUserUID)
    }
    const topicArray =
        {
            publish: user.topic,
            like: user.likeTopic,
            upvote: user.upvoteTopic,
            favorite: user.favoriteTopic
        }[type] ?? []

    const totalCount = await TopicModel.countDocuments({
        tid: { $in: topicArray },
        status: { $ne: 1 }
    }).lean()
    const data = await TopicModel.find({
        tid: { $in: topicArray },
        status: { $ne: 1 }
    })
        .sort({ created: -1 })
        .skip(skip)
        .limit(parseInt(limit))

    const topics = data.map((topic) => ({
        tid: topic.tid,
        title: topic.title,
        time: new Date(topic.created).getTime()
    }) as UserTopic)
    return { topics, totalCount }
})