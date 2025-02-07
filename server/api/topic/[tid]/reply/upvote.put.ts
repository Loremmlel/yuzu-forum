import {ReplyModel} from "~/server/models/reply";
import {UserModel} from "~/server/models/user";
import mongoose from "mongoose";
import {createMessage} from "~/server/utils/message";

async function updateReplyUpvote(uid: number, rid: number) {
    const reply = await ReplyModel.findOne({ rid })
    if (!reply) {
        return 10506
    }

    const userInfo = await UserModel.findOne({ uid })
    if (!userInfo) {
        return 10115
    }

    const point = userInfo.point
    if (point < 1100) {
        return 10508
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await ReplyModel.updateOne(
            { rid },
            {
                $set: { upvoteTime: Date.now() },
                $push: { upvotes: uid }
            }
        )
        await UserModel.updateOne({ uid }, { $inc: { point: -2 } })
        await UserModel.updateOne(
            { uid: reply.rUid },
            { $inc: { point: 1, upvote: 1 } }
        )
        await createMessage(
            uid,
            reply.rUid,
            'upvoted',
            reply.content.slice(0, 233),
            reply.tid,
            0
        )

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

    const { rid }: { rid: string } = await getQuery(event)
    if (!rid) {
        return yuzuError(event, 10507)
    }
    const result = await updateReplyUpvote(userInfo.uid, parseInt(rid))
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return '推⭐回复成功!'
})