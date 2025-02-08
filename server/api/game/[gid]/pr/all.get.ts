import {UserModel} from "~/server/models/user";
import {GamePRModel} from "~/server/models/gamePR";
import {GamePR} from "~/types/api/gamePR";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, 10507)
    }

    const { page, limit }: { page: string; limit: string } = await getQuery(event)
    if (!page || !limit) {
        return yuzuError(event, 10507)
    }
    if (limit !== '7') {
        return yuzuError(event, 10209)
    }

    const skip = (Number(page) - 1) * Number(limit)
    const totalCount = await GamePRModel.countDocuments({ gid }).lean()
    const data = await GamePRModel.find({ gid })
        .sort({ created: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'uid avatar name', UserModel)
        .lean()
    const prs = data.map((pr) => ({
        gprid: pr.gprid,
        gid: pr.gid,
        index: pr.index,
        status: pr.status,
        time: pr.created,
        completedTime: pr.completedTime,
        user: {
            uid: pr.user[0].uid,
            name: pr.user[0].name,
            avatar: pr.user[0].avatar
        }
    }) as GamePR)
    return { prs, totalCount }
})