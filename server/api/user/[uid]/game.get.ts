import {UserGame, UserGetGameRequestData} from "~/types/api/user";
import {UserModel} from "~/server/models/user";
import {GameModel} from "~/server/models/game";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const uid = getRouterParam(event, 'uid')
    if (!uid) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }

    const {page, limit, type}: UserGetGameRequestData = await getQuery(event)
    if (!page || !limit || !type) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (limit !== '50') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    const skip = (Number(page) - 1) * Number(limit)
    const user = await UserModel.findOne({uid}).lean()
    if (!user) {
        return yuzuError(event, ErrorCode.InvalidUserUID)
    }

    const gameArray =
        {
            publish: user.game,
            like: user.likeGame,
            favorite: user.favoriteGame,
            contribute: user.contributeGame
        }[type] ?? []

    const totalCount = await GameModel.countDocuments({
        gid: {$in: gameArray},
        status: {$ne: 1}
    }).lean()
    const data = await GameModel.find({
        gid: {$in: gameArray},
        status: {$ne: 1}
    }).sort({created: -1})
        .skip(skip)
        .limit(parseInt(limit))

    const games = data.map((game) => ({
        gid: game.gid,
        name: game.name,
        time: new Date(game.time).getTime()
    }) as UserGame)
    return {games, totalCount}
})