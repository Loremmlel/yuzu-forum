import {UserModel} from "~/server/models/user";
import {generateRoomName} from "~/server/utils/generateUtils";
import {ChatRoomModel} from "~/server/models/chatRoom";
import {ChatMessageModel} from "~/server/models/chatMessage";
import {Message} from "~/types/api/chatMessage";

/**
 * 处理用户消息发送的核心业务逻辑
 *
 * @param uid - 发送方用户ID（必需）
 * @param receiverUid - 接收方用户ID（必需）
 * @param content - 消息文本内容（必需）
 * @returns 格式化后的消息对象，符合前端Message接口规范
 *
 * 功能说明：
 * 1. 维护聊天室最新消息状态
 * 2. 持久化存储消息记录
 * 3. 标准化消息返回格式
 */
export async function sendMessage(uid: number, receiverUid: number, content: string) {
    // 获取发送者完整用户信息（使用lean转换普通对象提升性能）
    const user = await UserModel.findOne({uid}).lean()

    // 生成唯一聊天室标识（确保双向关系的一致性）
    const roomName = generateRoomName(receiverUid, uid)

    // 原子操作更新聊天室最新消息（用于聊天列表预览）
    await ChatRoomModel.findOneAndUpdate(
        {name: roomName},
        {
            lastMessage: {
                content,
                time: Date.now(),
                senderUid: uid,
                senderName: user!.name  // 实时更新发送者最新名称
            }
        }
    )

    // 创建完整消息记录（实现消息持久化和历史查询）
    const message = await ChatMessageModel.create({
        chatroomName: roomName,
        senderUid: uid,
        receiverUid: receiverUid,
        content,
        status: 'sent'  // 初始状态标记为已发送
    })

    // 构造标准化响应对象（适配前端数据结构要求）
    return {
        cmid: message.cmid,
        chatroomName: message.chatroomName,
        sender: {  // 聚合用户完整信息
            uid: user!.uid,
            name: user!.name,
            avatar: user!.avatar
        },
        receiverUid,
        content: message.content,
        time: message.time,  // 使用数据库自动生成的时间戳
        status: message.status
    } as Message
}
