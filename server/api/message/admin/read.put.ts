import {MessageAdminModel} from "~/server/models/messageAdmin";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    await MessageAdminModel.updateMany({}, {status: 'read'})
    return ReturnMessage.ReadAllAdminMessage
})