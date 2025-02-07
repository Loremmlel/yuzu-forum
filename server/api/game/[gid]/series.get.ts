import {GameModel} from "~/server/models/game";

interface GameSeries {
    gid: number
    name: YuzuLanguage
}

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, 10609)
    }

    const game = await GameModel.findOne({ gid, status: { $ne: 1 } }).lean()
    if (!game) {
        return yuzuError(event, 10610)
    }

    const series: GameSeries[] = await GameModel.find({
        gid: { $in: game.series }
    }).select({ _id: 0, gid: 1, name: 1 })

    return series
})