import {MessageAdminModel} from "~/server/models/messageAdmin";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }

    await MessageAdminModel.updateMany({}, { status: 'read' })
    return '已读所有消息成功!'
})