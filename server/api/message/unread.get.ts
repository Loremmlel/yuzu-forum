import {MessageModel} from "~/server/models/message";
import {MessageAdminModel} from "~/server/models/messageAdmin";
import {ChatMessageModel} from "~/server/models/chatMessage";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const message = await MessageModel.findOne({
        receiverUid: uid,
        status: 'unread'
    })

    const messageAdmin = await MessageAdminModel.findOne({
        status: 'unread'
    })

    const chatMessage = await ChatMessageModel.findOne({
        receiverUid: uid,
        'readBy.uid': {$ne: uid}
    })

    if (message || messageAdmin || chatMessage) {
        return '有未读消息!'
    } else {
        return '在线噢!'
    }
})