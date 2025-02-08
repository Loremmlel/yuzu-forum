import {MessageModel} from "~/server/models/message";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const uid = userInfo.uid

    const { mid }: { mid: string } = await getQuery(event)
    if (!mid) {
        return yuzuError(event, 10507)
    }
    await MessageModel.deleteOne({ receiverUid: uid, mid })

    return '删除消息成功!'
})