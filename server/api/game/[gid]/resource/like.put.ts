import {GameResourceModel} from "~/server/models/gameResource";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

async function updateGameResourceLike(grid: number, uid: number) {
    const resource = await GameResourceModel.findOne({grid}).lean()
    if (!resource) {
        return ErrorCode.ResourceLinkNotFound
    }
    if (resource.uid === uid) {
        return
    }
    if (resource.likes.includes(uid)) {
        return ErrorCode.AlreadyLikedResource
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await GameResourceModel.updateOne(
            {grid},
            {$addToSet: {likes: uid}}
        )
        await UserModel.updateOne(
            {uid},
            {$addToSet: {likeGameResource: grid}}
        )
        await UserModel.updateOne(
            {uid: resource.uid},
            {$inc: {point: 1, like: 1}}
        )
        await createMessage(
            uid,
            resource.uid,
            'liked',
            resource.link[0].slice(0, 233),
            0,
            resource.gid
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
    const {grid}: { grid: string } = await getQuery(event)
    if (!grid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const result = await updateGameResourceLike(Number(grid), uid)
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return ReturnMessage.LikeGameResource
})