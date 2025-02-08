import {UserModel} from "~/server/models/user";
import {generateRoomName} from "~/server/utils/generateUtils";
import {ChatRoomModel} from "~/server/models/chatRoom";
import {ChatMessageModel} from "~/server/models/chatMessage";
import {Message} from "~/types/api/chatMessage";

export async function sendMessage(uid: number, receiverUid: number, content: string) {
    const user = await UserModel.findOne({uid}).lean()

    const roomName = generateRoomName(receiverUid, uid)
    await ChatRoomModel.findOneAndUpdate(
        {name: roomName},
        {
            lastMessage: {
                content,
                time: Date.now(),
                senderUid: uid,
                senderName: user!.name
            }
        }
    )
    const message = await ChatMessageModel.create({
        chatroomName: roomName,
        senderUid: uid,
        receiverUid: receiverUid,
        content,
        status: 'sent'
    })
    return {
        cmid: message.cmid,
        chatroomName: message.chatroomName,
        sender: {
            uid: user!.uid,
            name: user!.name,
            avatar: user!.avatar
        },
        receiverUid,
        content: message.content,
        time: message.time,
        status: message.status
    } as Message
}