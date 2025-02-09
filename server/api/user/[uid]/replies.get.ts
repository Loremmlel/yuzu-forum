import {UserModel} from "~/server/models/user";
import {ReplyModel} from "~/server/models/reply";
import {UserReply} from "~/types/api/user";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const uid = getRouterParam(event, 'uid')
    if (!uid) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    const {page, limit}: YuzuPagination = await getQuery(event)
    if (!page || !limit) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (limit !== '50') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    const skip = (Number(page) - 1) * Number(limit)

    const user = await UserModel.findOne({uid}).lean()
    if (!user) {
        return yuzuError(event, ErrorCode.InvalidUserUID)
    }

    const totalCount = await ReplyModel.countDocuments({
        rid: {$in: user.reply},
        status: {$ne: 1}
    }).lean()
    const data = await ReplyModel.find({
        rid: {$in: user.reply},
        status: {$ne: 1}
    })
        .sort({created: -1})
        .skip(skip)
        .limit(Number(limit))
        .lean()

    const replies = data.map((reply) => ({
        tid: reply.tid,
        content: reply.content.slice(0, 100),
        time: reply.time
    }) as UserReply)
    return {replies, totalCount}
})