import {ChatRoomModel} from "~/server/models/chatRoom";
import {ChatMessageModel} from "~/server/models/chatMessage";
import {UserModel} from "~/server/models/user";
import {Message, MessageHistoryRequest} from "~/types/api/chatMessage";
import {generateRoomName} from "~/server/utils/generateUtils";
import {ErrorCode} from "~/error/errorCode";

/**
 * 定义一个处理聊天消息历史的API端点
 * 该端点用于获取与特定接收者之间的聊天消息历史
 *
 * @param event - 包含请求信息的事件对象
 * @returns 返回聊天消息历史数组，按时间逆序排列
 */
export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const {receiverUid, page, limit}: MessageHistoryRequest = getQuery(event)
    if (!receiverUid || !page || !limit) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (parseInt(receiverUid) === userInfo.uid) {
        return yuzuError(event, ErrorCode.CannotSendMessageToSelf)
    }
    if (limit !== '30') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }

    const roomName = generateRoomName(Number(receiverUid), uid)

    // 尝试查找聊天室，如果找不到，则创建新的聊天室并返回空消息数组
    const room = await ChatRoomModel.findOne({name: roomName}).lean()
    if (!room) {
        await ChatRoomModel.create({
            name: roomName,
            type: 'private',
            participants: [uid, receiverUid],
            lastMessage: {time: Date.now()}
        })
        return []
    }

    // 计算要跳过的消息数量，并查询消息历史
    const skip = (Number(page) - 1) * Number(limit)
    const histories = await ChatMessageModel.find({chatroomName: roomName})
        .sort({cmid: -1})
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'uid avatar name', UserModel)
        .lean()
    // 标记未读消息为已读
    const cmidArray = histories
        .filter((message) => !message.readBy.some((read) => read.uid === uid))
        .map((message) => message.cmid)
    if (cmidArray.length > 0) {
        await ChatMessageModel.updateMany(
            {cmid: {$in: cmidArray}, 'readBy.uid': {$ne: uid}},
            {$push: {readBy: {uid, readTime: Date.now()}}}
        )
    }

    // 将查询到的消息历史转换为API所需的格式并返回
    const messages = histories.map((message) => ({
        cmid: message.cmid,
        chatroomName: message.chatroomName,
        sender: {
            uid: message.user[0].uid,
            name: message.user[0].name,
            avatar: message.user[0].avatar
        },
        receiverUid: parseInt(receiverUid),
        content: message.content,
        time: message.time,
        status: message.status
    }) as Message)

    return messages.reverse()
})
