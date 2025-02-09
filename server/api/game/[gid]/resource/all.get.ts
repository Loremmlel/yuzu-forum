import {GameResourceModel} from "~/server/models/gameResource";
import {GameResource} from "~/types/api/gameResource";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const data = await GameResourceModel.find({gid})
        .sort({created: -1})
        .lean()

    return data.map((gameResource) => ({
        gid: gameResource.gid,
        grid: gameResource.grid,
        uid: gameResource.uid,
        type: gameResource.type,
        language: gameResource.language,
        platform: gameResource.platform,
        size: gameResource.size,
        time: gameResource.time,
        status: gameResource.status,
        likes: gameResource.likes
    }) as GameResource)
})