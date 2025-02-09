import mongoose from "mongoose";
import {GameContributor, GameDetail} from "~/types/api/game";
import {UserModel} from "~/server/models/user";
import {GameModel} from "~/server/models/game";
import {markdownToHtml} from "~/server/utils/markdown";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const gid = getRouterParam(event, 'gid')
    if (!gid) {
        return yuzuError(event, ErrorCode.GameIdReadFailed)
    }
    const userInfo = await getCookieTokenInfo(event)

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const game = await GameModel.findOne({gid}).lean()
        if (!game) {
            return yuzuError(event, ErrorCode.GameNotFound)
        }
        if (game.status === 1) {
            return 'banned'
        }

        await GameModel.updateOne({gid}, {$inc: {views: 1}})

        const publisher = await UserModel.findOne({uid: game.uid})
        if (!publisher) {
            return yuzuError(event, ErrorCode.UserNotFound)
        }

        const contributorData = await UserModel.find(
            {uid: {$in: game.contributor}},
            'uid avatar'
        )
        const contributor: GameContributor[] = contributorData.map((user) => ({
            uid: user.uid,
            avatar: user.avatar
        }))

        const introductionHtml: YuzuLanguage = {} as YuzuLanguage
        for (const key of Object.keys(game.introduction) as Array<keyof YuzuLanguage>) {
            introductionHtml[key] = await markdownToHtml(game.introduction[key])
        }

        const data: GameDetail = {
            gid: game.gid,
            vndbId: game.vndbId,
            user: {
                uid: publisher.uid,
                name: publisher.name,
                avatar: publisher.avatar
            },
            name: game.name,
            banner: game.banner,
            introduction: introductionHtml,
            markdown: game.introduction,
            time: game.time,
            views: game.views,
            platform: game.platform,
            language: game.language,
            contributor,
            likes: {
                count: game.likes.length,
                isLiked: game.likes.includes(userInfo?.uid ?? 0)
            },
            favorites: {
                count: game.favorites.length,
                isFavorite: game.favorites.includes(userInfo?.uid ?? 0)
            },
            alias: game.alias,
            official: game.official,
            engine: game.engine,
            tags: game.tags,
            series: game.series
        }
        await session.commitTransaction()
        return data
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
})