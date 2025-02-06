import {UpdateLogModel} from "~/server/models/updateLog";
import {GetUpdateLogRequestData, UpdateLog, UpdateType} from "~/types/api/updateLog";
import {yuzuError} from "~/server/utils/YuzuError";

async function getUpdateLogs(page: number, limit: number) {
    const skip = (page - 1) * limit
    const totalCount = await UpdateLogModel.countDocuments().lean()

    const updateLogs = await UpdateLogModel.find()
        .sort({upid: -1})
        .skip(skip)
        .limit(limit)

    const updates: UpdateLog[] = updateLogs.map(log => ({
        upid: log.upid,
        type: log.type as UpdateType,
        content: log.content,
        time: log.time,
        version: log.version
    }) as UpdateLog)

    return {updates, totalCount}
}

export default defineEventHandler(async (event) => {
    const {page, limit}: GetUpdateLogRequestData = await getQuery(event)
    if (!page || !limit) {
        return yuzuError(event, 10507)
    }
    if (limit !== '10') {
        return yuzuError(event, 10209)
    }
    return await getUpdateLogs(Number(page), Number(limit))
})