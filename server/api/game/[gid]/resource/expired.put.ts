import {GameResourceModel} from "~/server/models/gameResource";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

export default defineEventHandler(async (event) => {
    const {grid}: { grid: string } = await getQuery(event)
    if (!grid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const resource = await GameResourceModel.findOne({grid})
    if (!resource) {
        return yuzuError(event, ErrorCode.ResourceLinkNotFound)
    }
    if (resource.status === 1) {
        return yuzuError(event, ErrorCode.ResourceLinkExpired)
    }

    await GameResourceModel.updateOne({grid}, {status: 1}).lean()
    await createMessage(
        uid,
        resource.uid,
        'expired',
        resource.link[0].slice(0, 233),
        0,
        resource.gid
    )

    return ReturnMessage.ExpireGameResource
})