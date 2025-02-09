import {MessageModel} from "~/server/models/message";
import {MessageAdminModel} from "~/server/models/messageAdmin";
import {AsideItem} from "~/types/api/chatMessage";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const [
        message,
        messageCount,
        messageUnreadCount,
        messageAdmin,
        messageAdminCount,
        messageAdminUnreadCount
    ] = await Promise.all([
        MessageModel.findOne({receiverUid: uid}).sort({time: -1}).lean(),
        MessageModel.countDocuments({receiverUid: uid}),
        MessageModel.countDocuments({receiverUid: uid, status: 'unread'}),
        MessageAdminModel.findOne().sort({time: -1}).lean(),
        MessageAdminModel.countDocuments(),
        MessageAdminModel.countDocuments({status: 'unread'})
    ])

    const responseData: AsideItem[] = [
        {
            chatroomName: '',
            content: message ? message.content.slice(0, 100) : '',
            time: message?.time || 0,
            count: messageCount,
            unreadCount: messageUnreadCount,
            route: 'notice',
            title: '杂鱼~',
            avatar: ''
        },
        {
            chatroomName: '',
            content: '',
            time: messageAdmin?.time || 0,
            count: messageAdminCount,
            unreadCount: messageAdminUnreadCount,
            route: 'system',
            title: '杂鱼~',
            avatar: ''
        }
    ]

    return responseData
})
