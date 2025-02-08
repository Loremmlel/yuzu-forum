import {GameModel} from "~/server/models/game";
import {ErrorCode} from "~/error/errorCode";

interface GameSeries {
    gid: number
    name: YuzuLanguage
}

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.GameIdReadFailed)
    }

    const game = await GameModel.findOne({ gid, status: { $ne: 1 } }).lean()
    if (!game) {
        return yuzuError(event, ErrorCode.GameNotFound)
    }

    const series: GameSeries[] = await GameModel.find({
        gid: { $in: game.series }
    }).select({ _id: 0, gid: 1, name: 1 })

    return series
})