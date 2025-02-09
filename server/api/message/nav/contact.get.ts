import {ChatRoomModel} from "~/server/models/chatRoom";
import {AsideItem} from "~/types/api/chatMessage";
import {ChatMessageModel} from "~/server/models/chatMessage";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/error/errorCode";

/**
 * 获取用户的聊天室列表
 *
 * 此函数用于获取当前用户参与的所有聊天室信息，包括最后一条消息的内容、时间，
 * 未读消息数量等，并按最后一条消息的时间降序排列
 *
 * @param event - 事件对象，用于获取用户信息和返回响应
 * @returns 返回用户的聊天室列表，每个聊天室包括最后一条消息、未读消息数量等信息
 */
export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const userId = userInfo.uid

    // 查找用户参与的所有聊天室，排除最后一条消息的发送者UID为0的情况，并按最后一条消息的时间降序排列
    const chatRooms = await ChatRoomModel.find({
        participants: userId,
        'lastMessage.senderUid': {$ne: 0}
    }).sort({
        'lastMessage.time': -1
    })

    // 如果用户没有参与任何聊天室，则返回空数组
    if (!chatRooms.length) {
        return []
    }

    // 遍历每个聊天室，获取需要的信息
    return await Promise.all(
        chatRooms.map(async (chatRoom) => {
            // 获取聊天室的最后一条消息
            const lastMessage = chatRoom.lastMessage

            // 计算聊天室的消息总数
            const readCount = await ChatMessageModel.countDocuments({
                chatroomName: chatRoom.name
            })

            const unreadCount = await ChatMessageModel.countDocuments({
                chatroomName: chatRoom.name,
                senderUid: {$ne: userId},
                'readBy.uid': {$ne: userId}
            })

            // 获取聊天室的接收者UID，如果是私聊，则是另一个参与者；如果是群聊，则是聊天室名称
            const receiverUid = chatRoom.participants.filter((p) => p !== userId)[0]
            // 根据接收者UID获取接收者的信息
            const receiver = await UserModel.findOne({uid: receiverUid}).lean()

            // 根据聊天室类型确定路由和头像
            const chatRoute = chatRoom.type === 'private' ? receiverUid.toString() : chatRoom.name
            const chatAvatar = chatRoom.type === 'private' ? receiver!.avatar : chatRoom.avatar

            return {
                chatroomName: chatRoom.name,
                content: lastMessage.content,
                time: lastMessage.time,
                count: readCount,
                unreadCount: unreadCount,
                route: chatRoute,
                title: receiver!.name,
                avatar: chatAvatar
            } as AsideItem
        })
    )
})
