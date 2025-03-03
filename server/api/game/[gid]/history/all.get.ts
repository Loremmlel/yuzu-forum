import {GameHistoryModel} from "~/server/models/gameHistory";
import {UserModel} from "~/server/models/user";
import {GameHistory, GameHistoryAction, GameHistoryType} from "~/types/api/gameHistory";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.GameIdReadFailed)
    }
    const {page, limit}: { page: string, limit: string } = await getQuery(event)
    if (limit !== '7') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
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
        return {
            gid: history.gid,
            time: history.time,
            action: history.action as GameHistoryAction,
            type: history.type as GameHistoryType,
            content: history.content,
            user: {
                uid: history.user[0].uid,
                avatar: history.user[0].avatar,
                name: history.user[0].name
            }
        } as GameHistory
    })
    return {historyData, totalCount}
})