import {GameResourceModel} from "~/server/models/gameResource";
import {GameModel} from "~/server/models/game";
import {HomeGameResources} from "~/types/api/home";
import {ErrorCode} from "~/code&message/errorCode";

async function getHomeGameResources(page: number, limit: number) {
    const skip = (page - 1) * limit

    const resources = await GameResourceModel.find()
        .sort({time: -1})
        .skip(skip)
        .limit(limit)
        .populate('game', 'name', GameModel)
        .lean()
    return resources.map((resource) => ({
        gid: resource.gid,
        grid: resource.grid,
        uid: resource.uid,
        type: resource.type,
        language: resource.language,
        platform: resource.platform,
        size: resource.size,
        status: resource.status,
        likes: resource.likes,

        name: resource.game[0].name,
        time: resource.time
    }) as HomeGameResources)
}

export default defineEventHandler(async (event) => {
    const {page, limit}: YuzuPagination = await getQuery(event)
    if (limit !== '10') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    return await getHomeGameResources(Number(page), Number(limit))
})