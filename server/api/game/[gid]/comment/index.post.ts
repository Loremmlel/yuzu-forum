import {H3Event} from "h3";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {GameCommentModel} from "~/server/models/gameComment";
import {ErrorCode} from "~/code&message/errorCode";

async function readReply(event: H3Event) {
    const {toUid, content}: { toUid: number; content: string } = await readBody(event)
    if (!toUid || !content) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (content.trim().length > 1007) {
        return yuzuError(event, ErrorCode.CommentContentTooLong)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.TopicIdReadFailed)
    }

    return {
        gid: Number(gid),
        cUid: uid,
        toUid: toUid,
        content
    }
}

export default defineEventHandler(async (event) => {
    const result = await readReply(event)
    if (!result) {
        return
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await GameCommentModel.create(result)

        if (result.cUid !== result.toUid) {
            await UserModel.updateOne(
                {uid: result.toUid},
                {$inc: {point: 1}}
            )
            await createMessage(
                result.cUid,
                result.toUid,
                'commented',
                result.content.slice(0, 233),
                0,
                result.gid
            )
        }
        await session.commitTransaction()
        return '发布游戏评论成功!'
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})