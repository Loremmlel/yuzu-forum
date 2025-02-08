import {MessageModel} from "~/server/models/message";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const uid = userInfo.uid
    await MessageModel.updateMany({ receiverUid: uid }, { status: 'read' })

    return '已读所有消息成功!'
})