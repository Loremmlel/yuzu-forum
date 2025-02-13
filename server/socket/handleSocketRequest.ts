import {YzforumSocket} from "~/server/plugins/socket.io";
import {generateRoomName} from "~/server/utils/generateUtils";
import {sendMessage} from "~/server/socket/sendMessage";

enum ErrorCodes {
    missingUid = 'socket:error:1',
    invalidSocket = 'socket:error:2',
    cannotSendMessageToYourself = 'socket:error:3',
    contentTooLong = 'socket:error:4'
}

const userSockets: Map<number | undefined, YzforumSocket> = new Map()

/**
 * 处理Socket连接的核心控制器函数
 * @param socket - YzforumSocket实例，扩展了Socket.IO的Socket对象，包含用户认证负载信息
 *
 * 功能说明：
 * 1. 管理用户Socket连接的注册与销毁
 * 2. 处理私聊房间的加入/离开逻辑
 * 3. 处理实时消息的发送验证与分发
 */
export function handleSocketRequest(socket: YzforumSocket) {
    /* 私聊房间加入处理
     * - 使用双向用户ID生成标准化房间名称保证房间唯一性
     * - 将用户Socket实例存储在内存Map中用于后续消息路由
     * */
    socket.on('private:join', (receiverUid: number) => {
        const uid = socket.payload?.uid
        if (!uid) {
            socket.emit(ErrorCodes.missingUid)
            return
        }
        userSockets.set(uid, socket)
        const roomName = generateRoomName(uid, receiverUid)
        socket.join(roomName)
    })

    /* 消息发送全流程处理
     * 包含四个关键验证阶段：
     * 1. 用户身份验证：确保socket携带有效用户凭证
     * 2. 自发送校验：阻止用户给自己发送消息的无效操作
     * 3. 内容安全校验：过滤空消息和超长内容（1000字符限制）
     * 4. 连接状态验证：确保发送方Socket仍处于活跃状态 */
    socket.on('message:sending', async (receiverUid: number, content: string) => {
        const uid = socket.payload?.uid
        if (!uid) {
            socket.emit(ErrorCodes.missingUid)
            return false
        }
        if (uid === receiverUid) {
            socket.emit(ErrorCodes.cannotSendMessageToYourself)
            return false
        }
        if (!content.trim().length || content.length > 1000) {
            socket.emit(ErrorCodes.contentTooLong)
            return false
        }

        const sendingMessageUserSocket = userSockets.get(uid)
        if (!sendingMessageUserSocket) {
            socket.emit(ErrorCodes.invalidSocket)
            return false
        }

        /* 消息持久化与实时分发
         * - 调用消息服务进行数据库存储
         * - 通过房间机制实现点对点消息广播
         * - 使用双事件分别通知发送方和接收方保证状态同步 */
        const message = await sendMessage(uid, receiverUid, content)
        const roomName = generateRoomName(uid, receiverUid)
        sendingMessageUserSocket.emit('message:sent', message)
        sendingMessageUserSocket.to(roomName).emit('message:received', message)
    })

    /* 连接清理机制
     * 当用户主动断开或失去连接时，从内存存储中移除引用
     * 防止内存泄漏和无效连接堆积 */
    socket.on('private:leave', async () => {
        const uid = socket.payload?.uid
        if (uid) {
            userSockets.delete(uid)
        }
    })
}
