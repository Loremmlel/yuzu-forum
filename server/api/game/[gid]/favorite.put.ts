import {GameModel} from "~/server/models/game";
import mongoose from "mongoose";
import {UserModel} from "~/server/models/user";
import {createDeduplicatedMessage} from "~/server/utils/message";
import {findFirstNonNullProperty} from "~/server/utils/findFirstNonNullProperty";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

async function updateGameFavorite(gid: number, uid: number): Promise<ErrorCode> {
    const game = await GameModel.findOne({gid, status: {$ne: 1}}).lean()
    if (!game) {
        return ErrorCode.TopicNotFound
    }

    const isFavoriteGame = game.favorites.includes(uid)
    const pointAmount = isFavoriteGame ? -1 : 1

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await GameModel.updateOne(
            {gid},
            {[isFavoriteGame ? '$pull' : '$addToSet']: {favorites: uid}}
        )

        await UserModel.updateOne(
            {uid},
            {[isFavoriteGame ? '$pull' : '$addToSet']: {favoriteGame: gid}}
        )

        if (uid !== game.uid) {
            await UserModel.updateOne(
                {uid: game.uid},
                {$inc: {point: pointAmount}}
            )

            if (!isFavoriteGame) {
                await createDeduplicatedMessage(
                    uid,
                    game.uid,
                    'favorite',
                    findFirstNonNullProperty(game.name),
                    0,
                    gid
                )
            }
        }
        await session.commitTransaction()
        return ErrorCode.NoError
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
}

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.GameIdReadFailed)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const result = await updateGameFavorite(Number(gid), uid)
    if (result !== ErrorCode.NoError) {
        return yuzuError(event, result)
    }

    return ReturnMessage.FavoriteGame
})