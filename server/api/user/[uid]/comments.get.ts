import {UserModel} from "~/server/models/user";
import {CommentModel} from "~/server/models/comment";
import {UserComment} from "~/types/api/user";
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

    const user = await UserModel.findOne({uid: Number(uid)}).lean()
    if (!user) {
        return yuzuError(event, ErrorCode.InvalidUserUID)
    }

    const totalCount = await CommentModel.countDocuments({
        cid: {$in: user.comment},
        status: {$ne: 1}
    }).lean()
    const data = await CommentModel.find({
        cid: {$in: user.comment},
        status: {$ne: 1}
    }).sort({created: -1})
        .skip(skip)
        .limit(Number(limit))
        .lean()
    const comments = data.map(comment => ({
        tid: comment.tid,
        content: comment.content.slice(0, 100)
    }) as UserComment)
    return {comments, totalCount}
})