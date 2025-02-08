import {GameHistoryModel} from "~/server/models/gameHistory";
import {UserModel} from "~/server/models/user";
import {GameHistory, GameHistoryAction, GameHistoryType} from "~/types/api/gameHistory";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, 10609)
    }
    const {page, limit}: { page: string, limit: string } = await getQuery(event)
    if (limit !== '7') {
        return yuzuError(event, 10209)
    }

    const skip = (Number(page) - 1) * Number(limit)
    const totalCount = await GameHistoryModel.countDocuments({gid}).lean()
    const data = await GameHistoryModel.find({gid})
        .sort({created: -1})
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'uid avatar name', UserModel)
        .lean()
    const historyData = data.map(history => {
        const users = Array.isArray(history.user) ? history.user : [history.user]
        const user = users.length > 0 ? users[0] : null
        return {
            gid: history.gid,
            time: history.time,
            action: history.action as GameHistoryAction,
            type: history.type as GameHistoryType,
            content: history.content,
            user: {
                uid: user?.uid,
                avatar: user?.avatar,
                name: user?.name
            }
        } as GameHistory
    })
    return {historyData, totalCount}
})