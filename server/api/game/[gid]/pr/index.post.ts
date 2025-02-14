import {GameStoreTemp} from "~/store/types/edit/game";
import {checkGamePR} from "~/server/api/game/utils/checkGamePR";
import {GameModel} from "~/server/models/game";
import {compareObjects} from "~/server/utils/objectUtils";
import mongoose from "mongoose";
import {GamePRModel} from "~/server/models/gamePR";
import {GameHistoryModel} from "~/server/models/gameHistory";
import {isDeepEmpty} from "~/server/utils/isDeepEmpty";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

export default defineEventHandler(async (event) => {
    const game: GameStoreTemp = await readBody(event)
    const res = checkGamePR(game)
    if (res !== ErrorCode.NoError) {
        return yuzuError(event, res)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const originalGame = await GameModel.findOne({gid: game.gid}).lean()
    if (!originalGame) {
        return yuzuError(event, ErrorCode.GameNotFound)
    }
    const {gid, name, introduction, series, alias, official, tags} = originalGame
    const diffGame = compareObjects(game, {
        gid,
        name,
        introduction,
        series: series.map((s) => s.toString()),
        alias,
        official,
        tags
    })

    if (isDeepEmpty(diffGame)) {
        return yuzuError(event, ErrorCode.NoChangesDetected)
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const maxIndexPR = await GamePRModel.findOne({gid})
            .sort({index: -1})
            .lean()
        const baseIndex = maxIndexPR ? maxIndexPR.index : 0
        const index = baseIndex + 1
        await GamePRModel.create({
            gid: game.gid,
            uid: userInfo.uid,
            index,
            game: diffGame
        })
        await GameModel.updateOne(
            {gid: game.gid},
            {$set: {time: Date.now()}}
        )
        await GameHistoryModel.create({
            gid,
            uid: userInfo.uid,
            time: Date.now(),
            action: 'created',
            type: 'pr',
            content: ''
        })
        if (userInfo.uid !== originalGame.uid) {
            await createMessage(
                userInfo.uid,
                originalGame.uid,
                'requested',
                JSON.stringify(diffGame).slice(0, 233),
                0,
                gid
            )
        }
        await session.commitTransaction()
        return ReturnMessage.SubmitGamePR
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})