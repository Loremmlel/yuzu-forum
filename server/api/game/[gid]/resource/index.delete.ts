import {GameResourceModel} from "~/server/models/gameResource";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {GameModel} from "~/server/models/game";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const {grid}: { grid: string } = await getQuery(event)
    if (!grid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const resource = await GameResourceModel.findOne({grid}).lean()
    if (!resource) {
        return yuzuError(event, ErrorCode.ResourceLinkNotFound)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    if (resource.uid !== userInfo.uid) {
        return yuzuError(event, ErrorCode.NoPermissionForResource)
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await UserModel.updateOne(
            {uid: userInfo.uid},
            {
                $inc: {
                    point: -(resource.likes.length + 5),
                    like: -resource.likes.length
                }
            }
        )
        for (const likedUser of resource.likes) {
            await UserModel.updateOne(
                {uid: likedUser},
                {$pull: {likeGameResource: grid}}
            )
        }
        await GameModel.updateOne(
            {gid: resource.gid},
            {$pull: {resources: resource.grid}}
        )
        await GameResourceModel.deleteOne({grid})

        await session.commitTransaction()
        return '删除游戏资源成功!'
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})