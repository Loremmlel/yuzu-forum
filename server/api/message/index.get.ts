import {Message, MessageRequestData, MessageType, SortField} from "~/types/api/message";
import {MessageModel} from "~/server/models/message";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/error/errorCode";

async function getMessages(
    uid: number,
    page: number,
    limit: number,
    type: MessageType | '',
    sortField: SortField,
    sortOrder: YuzuOrder
) {
    const skip = (page - 1) * limit
    const sortOptions: Record<string, YuzuOrder> = {
        [sortField]: sortOrder === 'asc' ? 'asc' : 'desc'
    }
    const queryData = type ? { receiver_uid: uid, type } : { receiver_uid: uid }

    const data = await MessageModel.find(queryData)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('user', 'uid name avatar', UserModel)
        .lean()

    const totalCount = await MessageModel.countDocuments(queryData)
    const messages = data.map((message) => ({
        mid: message.mid,
        sender: {
            uid: message.user[0].uid,
            name: message.user[0].name,
            avatar: message.user[0].avatar
        },
        receiverUid: message.receiverUid,
        time: message.time,
        tid: message.tid,
        gid: message.gid,
        content: message.content,
        status: message.status,
        type: message.type
    }) as Message)

    return { messages, totalCount }
}

export default defineEventHandler(async (event) => {
    const { page, limit, type, sortField, sortOrder }: MessageRequestData = await getQuery(event)
    if (limit !== '10') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    return await getMessages(
        uid,
        parseInt(page),
        parseInt(limit),
        type || '',
        sortField || 'time',
        sortOrder
    )
})