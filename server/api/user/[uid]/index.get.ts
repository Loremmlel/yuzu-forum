import {UserModel} from "~/server/models/user";
import {UserInfo} from "~/types/api/user";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const uid = getRouterParam(event, 'uid')
    if (!uid) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    const uidNumber = Number(uid)
    if (uidNumber <= 0) {
        return yuzuError(event, ErrorCode.InvalidUserUID)
    }
    const user = await UserModel.findOne({uid: uidNumber})
    if (!user) {
        return yuzuError(event, ErrorCode.InvalidUserUID)
    }
    if (user.status === 1) {
        return 'banned'
    }

    return {
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        roles: user.roles,
        status: user.status,
        time: user.time,
        point: user.point,
        bio: user.bio,
        upvote: user.upvote,
        like: user.like,
        dislike: user.dislike,

        reply: user.reply.length,
        comment: user.comment.length,

        topic: user.topic.length,
        likeTopic: user.likeTopic.length,
        upvoteTopic: user.upvoteTopic.length,
        favoriteTopic: user.favoriteTopic.length,

        game: user.game.length,
        likeGame: user.likeGame.length,
        favoriteGame: user.favoriteGame.length,
        contributeGame: user.contributeGame.length,

        dailyTopicCount: user.dailyTopicCount,
        dailyGameCount: user.dailyGameCount
    } as UserInfo
})