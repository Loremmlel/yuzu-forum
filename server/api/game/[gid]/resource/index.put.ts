import {GameResourceStoreTemp} from "~/store/types/game/resource";
import {checkGameResourcePublish} from "~/server/api/game/utils/checkGameResourcePublish";
import {GameResourceModel} from "~/server/models/gameResource";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const body: GameResourceStoreTemp = await readBody(event)
    if (!body) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    const res = checkGameResourcePublish(body)
    if (res !== ErrorCode.NoError) {
        return yuzuError(event, res)
    }
    const {grid}: { grid: string } = await getQuery(event)
    if (!grid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    await GameResourceModel.updateOne({grid, uid}, {...body})

    return '更新游戏资源成功!'
})