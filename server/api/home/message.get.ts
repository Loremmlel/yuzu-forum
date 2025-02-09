import {HomeMessage} from "~/types/api/home";
import {MessageModel} from "~/server/models/message";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/code&message/errorCode";

async function getMessages(page: number, limit: number) {
    const skip = (page - 1) * limit

    const data = await MessageModel.find({
        type: {$in: ['upvoted', 'replied', 'commented', 'requested']}
    })
        .sort({time: -1})
        .skip(skip)
        .limit(limit)
        .populate('user', 'name', UserModel)
        .lean()

    return data.map((message) => ({
        uid: message.senderUid,
        name: message.user[0].name,
        tid: message.tid,
        gid: message.gid,
        type: message.type,
        content: message.content.slice(0, 50),
        time: message.time
    }) as HomeMessage)
}

export default defineEventHandler(async (event) => {
    const {page, limit}: YuzuPagination = await getQuery(event)
    if (limit !== '10') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }

    return await getMessages(Number(page), Number(limit))
})