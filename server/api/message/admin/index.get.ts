import {MessageAdminModel} from "~/server/models/messageAdmin";
import {UserModel} from "~/server/models/user";
import {MessageAdmin} from "~/types/api/messageAdmin";

export default defineEventHandler(async (_) => {
    const messageAdmin = await MessageAdminModel.find()
        .sort({ maid: -1 })
        .populate('user', 'uid name avatar', UserModel)
        .lean()

    return messageAdmin.map((message) => ({
        maid: message.maid,
        time: message.time,
        status: message.status,
        content: message.content,
        admin: {
            uid: message.user[0].uid,
            name: message.user[0].name,
            avatar: message.user[0].avatar
        }
    }) as MessageAdmin)
})