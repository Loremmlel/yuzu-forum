import {GameResourceModel} from "~/server/models/gameResource";
import {UserModel} from "~/server/models/user";
import {GameResourceDetails} from "~/types/api/gameResource";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const { grid }: { grid: string } = await getQuery(event)
    if (!grid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const data = await GameResourceModel.findOne({ grid })
        .populate('user', 'uid avatar name', UserModel)
        .lean()
    if (!data) {
        return yuzuError(event, ErrorCode.ResourceLinkNotFound)
    }

    return  {
        gid: data.gid,
        grid: data.grid,
        uid: data.uid,
        type: data.type,
        language: data.language,
        platform: data.platform,
        size: data.size,
        time: data.time,
        status: data.status,
        likes: data.likes,
        link: data.link,
        code: data.code,
        password: data.password,
        note: data.note,
        user: {
            uid: data.user[0].uid,
            name: data.user[0].name,
            avatar: data.user[0].avatar
        }
    } as GameResourceDetails
})