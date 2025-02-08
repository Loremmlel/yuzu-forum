import {H3Event} from "h3";
import {UserModel} from "~/server/models/user";
import {GameModel} from "~/server/models/game";
import mongoose from "mongoose";
import {GameHistoryModel} from "~/server/models/gameHistory";
import {GamePRModel} from "~/server/models/gamePR";
import {ErrorCode} from "~/error/errorCode";

async function checkUpdate(event: H3Event) {
    const { gprid, note }: { gprid: number; note: string } = await readBody(event)
    if (!gprid || !note) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (!note.trim() || note.length > 1007) {
        return yuzuError(event, ErrorCode.RejectionReasonRequired)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const user = await UserModel.findOne({ uid: userInfo.uid }).lean()
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }

    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    const game = await GameModel.findOne({ gid }).lean()
    if (!game) {
        return yuzuError(event, ErrorCode.GameNotFound)
    }

    if (userInfo.uid !== game.uid && user.roles < 2) {
        return yuzuError(event, ErrorCode.NoPermissionForUpdateRequest)
    }

    return { uid: userInfo.uid, gprid, note }
}

export default defineEventHandler(async (event) => {
    const result = await checkUpdate(event)
    if (!result) {
        return
    }
    const { uid, gprid, note } = result

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const gamePR = await GamePRModel.findOneAndUpdate(
            { gprid },
            { status: 2, note, game: {} }
        ).lean()
        if (!gamePR) {
            return yuzuError(event, ErrorCode.GameNotFound)
        }
        if (gamePR.status !== 0) {
            return yuzuError(event, ErrorCode.UpdateRequestAlreadyProcessed)
        }

        await GameHistoryModel.create({
            gid: gamePR.gid,
            uid,
            time: Date.now(),
            action: 'declined',
            type: 'pr',
            content: `#${gamePR.index} ${note}`
        })

        if (uid !== gamePR.uid) {
            await createMessage(
                uid,
                gamePR.uid,
                'declined',
                `#${gamePR.index} ${note}`,
                0,
                gamePR.gid
            )
        }

        await session.commitTransaction()
        return '拒绝游戏拉取请求成功!'
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})