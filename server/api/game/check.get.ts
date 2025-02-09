import {GameModel} from "~/server/models/game";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const {vndbId}: { vndbId: string } = await getQuery(event)
    if (!vndbId) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const game = await GameModel.countDocuments({vndbId})
    if (game) {
        return yuzuError(event, ErrorCode.GameAlreadyExists)
    }

    return '这个游戏尚未被上传到论坛!'
})