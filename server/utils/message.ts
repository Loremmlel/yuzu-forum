import {MessageType} from "~/types/api/message";
import {MessageModel} from "~/server/models/message";

export async function createMessage(
    senderUid: number,
    receiverUid: number,
    type: MessageType,
    content: string,
    tid: number,
    gid: number
) {
    const newTopic = new MessageModel({
        senderUid,
        receiverUid,
        time: Date.now(),
        type,
        content,
        tid,
        gid
    })
    return await newTopic.save()
}

// 当用户在点赞和点踩之间切换时，可能发送重复请求
export async function createDeduplicatedMessage(
    senderUid: number,
    receiverUid: number,
    type: MessageType,
    content: string,
    tid: number,
    gid: number
) {
    const existingMessage = await MessageModel.findOne({
        senderUid,
        receiverUid,
        type,
        content,
        tid,
        gid
    })
    if (existingMessage) {
        return
    }

    const newTopic = new MessageModel({
        senderUid,
        receiverUid,
        time: Date.now(),
        type,
        content,
        tid,
        gid
    })
    return await newTopic.save()
}