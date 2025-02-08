import {MessageModel} from "~/server/models/message";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid
    await MessageModel.updateMany({ receiverUid: uid }, { status: 'read' })

    return '已读所有消息成功!'
})