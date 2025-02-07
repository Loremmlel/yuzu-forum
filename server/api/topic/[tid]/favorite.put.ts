import {TopicModel} from "~/server/models/topic";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {createDeduplicatedMessage} from "~/server/utils/message";

async function updateTopicFavorite(uid: number, tid: number) {
    const topic = await TopicModel.findOne({ tid })
    if (!topic) {
        return 10211
    }
    const isFavoriteTopic = topic.favorites.includes(uid)
    const pointAmount = isFavoriteTopic ? -1 : 1

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await TopicModel.updateOne(
            { tid },
            { [isFavoriteTopic ? '$pull' : '$addToSet']: { favorites: uid } }
        )
        await UserModel.updateOne(
            { uid },
            { [isFavoriteTopic ? '$pull' : '$addToSet']: { favoriteTopic: tid } }
        )
        if (uid !== topic.uid) {
            await UserModel.updateOne(
                { uid: topic.uid },
                { $inc: { point: pointAmount } }
            )

            if (!isFavoriteTopic) {
                await createDeduplicatedMessage(
                    uid,
                    topic.uid,
                    'favorite',
                    topic?.content.slice(0, 233) ?? '',
                    tid,
                    0
                )
            }
        }

        await session.commitTransaction()
        return null
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
}

export default defineEventHandler(async (event) => {
    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, 10210)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }

    const result = await updateTopicFavorite(userInfo.uid, Number(tid))
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }
    return '收藏主题成功!'
})