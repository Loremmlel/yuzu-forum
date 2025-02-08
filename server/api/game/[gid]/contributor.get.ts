import {GameModel} from "~/server/models/game";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.GameIdReadFailed)
    }

    const game = await GameModel.findOne({ gid, status: { $ne: 1 } }).lean()
    if (!game) {
        return yuzuError(event, ErrorCode.GameNotFound)
    }

    const users: YuzuUser[] = await UserModel.find({
        uid: { $in: game.contributor }
    }).select({ _id: 0, uid: 1, name: 1, avatar: 1 })

    return users
})