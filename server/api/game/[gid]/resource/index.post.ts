import {H3Event} from "h3";
import {GameResourceStoreTemp} from "~/store/types/game/resource";
import {checkGameResourcePublish} from "~/server/api/game/utils/checkGameResourcePublish";
import mongoose from "mongoose";
import {GameResourceModel} from "~/server/models/gameResource";
import {UserModel} from "~/server/models/user";
import {GameModel} from "~/server/models/game";
import {ErrorCode} from "~/code&message/errorCode";

async function getResource(event: H3Event) {
    const body: GameResourceStoreTemp = await readBody(event)
    if (!body) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    const res = checkGameResourcePublish(body)
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

    return {
        ...body,
        gid,
        uid
    }
}

export default defineEventHandler(async (event) => {
    const result = await getResource(event)
    if (!result) {
        return
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const resource = await GameResourceModel.create({
            ...result,
            time: Date.now()
        })
        await UserModel.updateOne(
            {uid: result.uid},
            {
                $addToSet: {
                    gameResource: resource.grid,
                    contributeGame: result.gid
                },
                $inc: {point: 3}
            }
        )
        await GameModel.updateOne(
            {gid: result.gid},
            {
                $set: {time: Date.now()},
                $addToSet: {
                    contributor: result.uid,
                    resources: resource.grid,
                    type: result.type,
                    language: result.language,
                    platform: result.platform
                }
            }
        )

        await session.commitTransaction()
        return '创建游戏资源成功!'
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})