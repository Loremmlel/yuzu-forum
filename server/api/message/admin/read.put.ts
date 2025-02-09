import {MessageAdminModel} from "~/server/models/messageAdmin";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    await MessageAdminModel.updateMany({}, {status: 'read'})
    return '已读所有消息成功!'
})