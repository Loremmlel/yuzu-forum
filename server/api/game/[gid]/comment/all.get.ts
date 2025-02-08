import {GameCommentModel} from "~/server/models/gameComment";
import {UserModel} from "~/server/models/user";
import {GameComment} from "~/types/api/gameComment";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, 10609)
    }
    const {page, limit, order}: { page: string, limit: string, order: YuzuOrder } = await getQuery(event)
    if (!page || !limit) {
        return yuzuError(event, 10507)
    }
    if (limit !== '10') {
        return yuzuError(event, 10209)
    }

    const skip = (Number(page) - 1) * Number(limit)
    const totalCount = await GameCommentModel.countDocuments({gid}).lean()
    const data = await GameCommentModel.find({gid})
        .sort({created: order})
        .skip(skip)
        .limit(Number(limit))
        .populate('cUser', 'uid avatar name', UserModel)
        .populate('toUser', 'uid name', UserModel)
        .lean()

    const userInfo = await getCookieTokenInfo(event)
    const comments = data.map(comment => {
        const cUser = Array.isArray(comment.cUser) ? comment.cUser : [comment.cUser]
        return {
            gcid: comment.gcid,
            gid: comment.gid,
            time: new Date(comment.created).getTime(),
            content: comment.content,
            likes: {
                count: comment.likes.length,
                isLiked: comment.likes.includes(userInfo?.uid ?? 0)
            },
            user: {
                uid: cUser[0].uid,
                name: cUser[0].name,
                avatar: cUser[0].avatar
            },
            toUser: comment.toUser?.length ? {
                uid: comment.toUser[0].uid,
                name: comment.toUser[0].name
            } : 0
        } as GameComment
    })
    return {comments, totalCount}
})