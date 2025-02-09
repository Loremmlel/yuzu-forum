import {GameModel} from "~/server/models/game";
import {HomeGame} from "~/types/api/home";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/error/errorCode";

async function getHomeGames(page: number, limit: number) {
    const skip = (page - 1) * limit

    const games = await GameModel.find({status: {$ne: 1}})
        .sort({time: -1})
        .skip(skip)
        .limit(limit)
        .lean()

    return Promise.all(
        games.map(async (game) => {
            const contributors = await Promise.all(
                game.contributor.map(async (uid: number) => {
                    const user = await UserModel.findOne({uid}).lean()
                    return {
                        uid,
                        name: user?.name ?? '',
                        avatar: user?.avatar ?? ''
                    }
                })
            )
            return {
                gid: game.gid,
                name: game.name,
                time: game.time,
                views: game.views,
                contributors,
                languages: game.language,
                platforms: game.platform
            } as HomeGame
        })
    )
}

export default defineEventHandler(async (event) => {
    const {page, limit}: YuzuPagination = await getQuery(event)
    if (limit !== '10') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    return await getHomeGames(Number(page), Number(limit))
})