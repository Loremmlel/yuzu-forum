import {GameLinkModel} from "~/server/models/gameLink";
import {GameLink} from "~/types/api/gameLink";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const data = await GameLinkModel.find({gid}).sort({created: -1}).lean()
    return data.map(link => ({
        gid: link.gid,
        glid: link.glid,
        uid: link.uid,
        name: link.name,
        link: link.link
    }) as GameLink)
})