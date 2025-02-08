import {H3Event} from "h3";
import {checkGameLinkPublish} from "~/server/api/game/utils/checkGameLinkPublish";
import mongoose from "mongoose";
import {GameLinkModel} from "~/server/models/gameLink";
import {GameModel} from "~/server/models/game";
import {GameHistoryModel} from "~/server/models/gameHistory";
import {ErrorCode} from "~/error/errorCode";

async function getLink(event: H3Event) {
    const {name, link}: { name: string; link: string } = await readBody(event)
    if (!name || !link) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    const res = checkGameLinkPublish(name, link)
    if (res !== ErrorCode.NoError) {
        return yuzuError(event, res)
    }
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    return {gid, uid, name, link}
}

export default defineEventHandler(async (event) => {
    const result = await getLink(event)
    if (!result) {
        return
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        await GameLinkModel.create({ ...result })
        await GameModel.updateOne(
            { gid: result.gid },
            {
                $set: { time: Date.now() },
                $addToSet: { contributor: result.uid }
            }
        )
        await session.commitTransaction()
        await GameHistoryModel.create({
            gid: Number(result.gid),
            uid: result.uid,
            time: Date.now(),
            action: 'created',
            type: 'link',
            content: result.name
        })
        return '创建游戏相关链接成功!'
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})