import {TopicModel} from "~/server/models/topic";
import {UserModel} from "~/server/models/user";
import {TopicRSS} from "~/types/api/rss";

export default defineEventHandler(async (event) => {
    const {language}: {language: Language} = await getQuery(event)
    if (!language) {
        return yuzuError(event, 10507)
    }
    const data = await TopicModel.find()
        .sort({created: 'desc'})
        .limit(10)
        .populate('user', 'uid, avatar name', UserModel)
        .lean()
    return data.map(topic => ({
        tid: topic.tid,
        name: topic.title,
        user: {
            uid: topic.user[0].uid,
            avatar: topic.user[0].avatar,
            name: topic.user[0].name
        },
        time: topic.time,
        description: topic.content.slice(0, 233)
    }) as TopicRSS)
})