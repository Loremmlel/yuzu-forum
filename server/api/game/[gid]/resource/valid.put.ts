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

    const resource = await GameResourceModel.findOne({grid})
    if (!resource) {
        return yuzuError(event, ErrorCode.ResourceLinkNotFound)
    }
    if (resource.uid !== userInfo.uid) {
        return yuzuError(event, ErrorCode.NoPermissionForResource)
    }

    await GameResourceModel.updateOne({grid}, {status: 0}).lean()

    return ReturnMessage.ValidGameResource
})