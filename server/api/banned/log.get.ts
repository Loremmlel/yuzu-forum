import {BannedModel} from "~/server/models/banned";
import {BannedLog, BannedLogRequestData} from "~/types/api/banned";
import {ErrorCode} from "~/error/errorCode";

async function getBannedLogs(page: number, limit: number) {
    const skip = (page - 1) * limit

    const bannedLogs = await BannedModel.find()
        .sort({bid: -1})
        .skip(skip)
        .limit(limit)
        .lean()

    return bannedLogs.map(log => ({
        bid: log.bid,
        uid: log.uid,
        name: log.name,
        description: log.description,
        time: log.time,
        result: log.result
    }) as BannedLog)
}

export default defineEventHandler(async (event) => {
    const {page, limit, language}: BannedLogRequestData = await getQuery(event)
    if (!page || !limit || !language) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (limit !== '4') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }

    return await getBannedLogs(Number(page), Number(limit))
})