import {GameModel} from "~/server/models/game";

export default defineEventHandler(async (event) => {
    const {vndbId}: {vndbId: string} = await getQuery(event)
    if (!vndbId) {
        return yuzuError(event, 10507)
    }

    const game = await GameModel.countDocuments({vndbId})
    if (game) {
        return yuzuError(event, 10641)
    }

    return '这个游戏尚未被上传到论坛!'
})