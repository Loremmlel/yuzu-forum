import {GameModel} from "~/server/models/game";
import {GameCommentModel} from "~/server/models/gameComment";
import {UserModel} from "~/server/models/user";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, 10507)
    }
    const game = await GameModel.findOne({ gid }).lean()
    if (!game) {
        return yuzuError(event, 10610)
    }

    const { gcid }: { gcid: string } = await getQuery(event)
    if (!gcid) {
        return yuzuError(event, 10507)
    }

    const comment = await GameCommentModel.findOne({ gcid }).lean()
    if (!comment) {
        return
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const user = await UserModel.findOne({ uid: userInfo.uid }).lean()
    if (!user) {
        return yuzuError(event, 10101)
    }

    // 不是游戏发布者、且不是评论发布者或管理员，则不能删除
    if (comment.cUid !== user.uid && game.uid !== user.uid && user.roles < 2) {
        return yuzuError(event, 10639)
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        if (comment.toUid && comment.cUid !== comment.toUid) {
            await UserModel.updateOne(
                { uid: comment.toUid },
                { $inc: {point: -1 } }
            )
        }
        await UserModel.updateOne(
            { uid: comment.cUid },
            {
                $inc: {
                    point: -comment.likes.length,
                    like: -comment.likes.length
                }
            }
        )
        await GameCommentModel.deleteOne({ gcid })
        await session.commitTransaction()
        return '删除游戏评论成功!'
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        await session.endSession()
    }
})
