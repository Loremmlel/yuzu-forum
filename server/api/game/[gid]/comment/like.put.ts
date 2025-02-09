import {UserModel} from "~/server/models/user";
import {GameCommentModel} from "~/server/models/gameComment";
import mongoose from "mongoose";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

async function updateGameCommentLike(gcid: number, uid: number) {
    const comment = await GameCommentModel.findOne({gcid}).lean()
    if (!comment) {
        return ErrorCode.ResourceLinkNotFound
    }
    if (comment.cUid === uid) {
        return
    }
    if (comment.likes.includes(uid)) {
        return ErrorCode.AlreadyLikedResource
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await GameCommentModel.updateOne({gcid}, {$addToSet: {likes: uid}})
        await UserModel.updateOne(
            {uid: comment.cUid},
            {$inc: {point: 1, like: 1}}
        )
        await createMessage(
            uid,
            comment.cUid,
            'liked',
            comment.content.slice(0, 233),
            0,
            comment.gid
        )
        await session.commitTransaction()
        return null
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
}

export default defineEventHandler(async (event) => {
    const {gcid}: { gcid: string } = await getQuery(event)
    if (!gcid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const result = await updateGameCommentLike(parseInt(gcid), uid)
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return ReturnMessage.LikeGameComment
})