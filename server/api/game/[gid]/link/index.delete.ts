import {GameLinkModel} from "~/server/models/gameLink";
import mongoose from "mongoose";
import {GameHistoryModel} from "~/server/models/gameHistory";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const {glid}: { glid: string } = await getQuery(event)
    if (!glid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const link = await GameLinkModel.findOne({glid}).lean()
    if (!link) {
        return yuzuError(event, ErrorCode.GameLinkNotFound)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    if (link.uid !== userInfo.uid) {
        return yuzuError(event, ErrorCode.NoPermissionForResource)
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await GameLinkModel.deleteOne({glid})
        await GameHistoryModel.create({
            gid: link.gid,
            uid: link.uid,
            time: Date.now(),
            action: 'deleted',
            type: 'link',
            content: link.name
        })
        await session.commitTransaction()
        return '删除游戏相关链接成功!'
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})