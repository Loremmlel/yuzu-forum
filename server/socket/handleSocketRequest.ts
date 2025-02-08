import {YzforumSocket} from "~/server/plugins/socket.io";
import {generateRoomName} from "~/server/utils/generateUtils";
import {sendMessage} from "~/server/socket/sendMessage";

enum ErrorCodes {
    missingUid = 'socket:error:1',
    invalidSocket = 'socket:error:2',
    cannotSendMessageToYourself = 'socket:error:3',
    contentTooLong = 'socket:error:4'
}

// 创建一个Map来存储用户的socket信息，键为用户ID，值为socket实例
const userSockets: Map<number | undefined, YzforumSocket> = new Map()

/**
 * 处理socket请求的函数，用于监听和响应客户端的socket事件
 * @param socket 当前用户的socket实例
 */
export function handleSocketRequest(socket: YzforumSocket) {
    // 监听私聊加入事件
    socket.on('private:join', (receiverUid: number) => {
        const uid = socket.payload?.uid
        if (!uid) {
            socket.emit(ErrorCodes.missingUid)
            return
        }
        userSockets.set(uid, socket)
        // 生成房间名并加入房间
        const roomName = generateRoomName(uid, receiverUid)
        socket.join(roomName)
    })

    // 监听消息发送事件
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

        // 获取发送者用户的socket实例
        const sendingMessageUserSocket = userSockets.get(uid)
        if (!sendingMessageUserSocket) {
            socket.emit(ErrorCodes.invalidSocket)
            return false
        }

        // 发送消息并广播
        const message = await sendMessage(uid, receiverUid, content)
        const roomName = generateRoomName(uid, receiverUid)
        sendingMessageUserSocket.emit('message:sent', message)
        sendingMessageUserSocket.to(roomName).emit('message:received', message)
    })

    // 监听私聊离开事件
    socket.on('private:leave', async () => {
        const uid = socket.payload?.uid
        if (uid) {
            userSockets.delete(uid)
        }
    })
}
