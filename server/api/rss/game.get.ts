import {GameModel} from "~/server/models/game";
import {UserModel} from "~/server/models/user";
import {GameRSS} from "~/types/api/rss";
import {getPreferredLanguageText} from "~/utils/getPreferredLanguageText";

export default defineEventHandler(async (event) => {
    const {language}: {language: Language} = await getQuery(event)
    if (!language) {
        return yuzuError(event, 10507)
    }
    const data = await GameModel.find()
        .sort({created: 'desc'})
        .limit(10)
        .populate('user', 'uid avatar name', UserModel)
        .lean()
    return data.map((game) => ({
        gid: game.gid,
        name: getPreferredLanguageText(game.name, language),
        banner: game.banner,
        user: {
            uid: game.user[0].uid,
            avatar: game.user[0].avatar,
            name: game.user[0].name
        },
        time: game.time,
        description: getPreferredLanguageText(game.introduction, language).slice(0, 233)
    }) as GameRSS)
})