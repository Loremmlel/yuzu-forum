import {LanguageOptions, PlatformOptions, TypeOptions} from "~/components/game/utils/option";
import {FilterQuery} from "mongoose";
import {Game} from "~/server/models/types/game";
import {GameModel} from "~/server/models/game";
import {UserModel} from "~/server/models/user";
import {GameCard, GamePageRequestData} from "~/types/api/game";
import {ErrorCode} from "~/error/errorCode";

async function getGames(
    page: number,
    limit: number,
    type: TypeOptions,
    language: LanguageOptions,
    platform: PlatformOptions,
    sortField: 'time' | 'created' | 'views',
    sortOrder: YuzuOrder
) {
    const skip = (page - 1) * limit

    const queryData: FilterQuery<Game> = {
        status: {$ne: 1},
        ...(type === 'all' ? {} : {type: {$elemMatch: {$eq: type}}}),
        ...(language === 'all' ? {} : {language: {$elemMatch: {$eq: language}}}),
        ...(platform === 'all' ? {} : {platform: {$elemMatch: {$eq: platform}}})
    }
    const totalCount = await GameModel.countDocuments(queryData)
    const games = await GameModel.find(queryData)
        .sort({[sortField]: sortOrder})
        .skip(skip)
        .limit(limit)
        .populate('user', 'uid avatar name', UserModel)
        .lean()
    const gameCards = games.map(game => ({
        gid: game.gid,
        name: game.name,
        banner: game.banner,
        user: {
            uid: game.user[0].uid,
            name: game.user[0].name,
            avatar: game.user[0].avatar
        },
        views: game.views,
        likes: game.likes.length,
        favorites: game.favorites.length,
        time: game.time,
        platform: game.platform,
        language: game.language
    }) as GameCard)
    return {gameCards, totalCount}
}

export default defineEventHandler(async (event) => {
    const {
        page,
        limit,
        type,
        language,
        platform,
        sortField,
        sortOrder
    }: GamePageRequestData = await getQuery(event)
    if (!page || !limit || !sortField || !sortOrder) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (limit !== '24') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }
    return await getGames(
        Number(page),
        Number(limit),
        type,
        language,
        platform,
        sortField as 'time' | 'created' | 'views',
        sortOrder
    )
})