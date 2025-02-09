import {FilterQuery} from "mongoose";
import {Topic} from "~/server/models/types/topic";
import {TopicModel} from "~/server/models/topic";
import {UserModel} from "~/server/models/user";
import {SearchResultComment, SearchResultReply, SearchResultTopic, SearchResultUser} from "~/types/api/search";
import {Game} from "~/server/models/types/game";
import {GameModel} from "~/server/models/game";
import {HomeGame} from "~/types/api/home";
import {ReplyModel} from "~/server/models/reply";
import {CommentModel} from "~/server/models/comment";

export async function searchTopic(keywords: string[], skip: number, limit: number) {
    const searchQuery: FilterQuery<Topic> = {
        $and: [
            {status: {$ne: 1}},
            {
                $or: [
                    {title: {$regex: keywords.join('|'), $options: 'i'}},
                    {content: {$regex: keywords.join('|'), $options: 'i'}},
                    {category: {$in: keywords}},
                    {tags: {$in: keywords}}
                ]
            }
        ]
    }
    const data = await TopicModel.find(searchQuery)
        .sort({time: -1})
        .skip(skip)
        .limit(limit)
        .populate('user', 'uid avatar name', UserModel)
        .lean()

    return data.map(topic => ({
        tid: topic.tid,
        title: topic.title,
        views: topic.views,
        likes: topic.likes.length,
        replies: topic.replies.length,
        comments: topic.comments,
        time: topic.time,
        tags: topic.tags,
        section: topic.section,
        user: {
            uid: topic.user[0].uid,
            avatar: topic.user[0].avatar,
            name: topic.user[0].name
        },
        status: topic.status,
        upvoteTime: topic.upvoteTime
    }) as SearchResultTopic)
}

export async function searchGame(keywords: string[], skip: number, limit: number) {
    const searchQuery: FilterQuery<Game> = {
        $and: [
            {status: {$ne: 1}},
            {
                $or: [
                    {'name.en-us': {$regex: keywords.join('|'), $options: 'i'}},
                    {'name.zh-cn': {$regex: keywords.join('|'), $options: 'i'}},
                    {'name.ja-jp': {$regex: keywords.join('|'), $options: 'i'}},
                    {'introduction.en-us': {$regex: keywords.join('|'), $options: 'i'}},
                    {'introduction.zh-cn': {$regex: keywords.join('|'), $options: 'i'}},
                    {'introduction.ja-jp': {$regex: keywords.join('|'), $options: 'i'}},
                    {alias: {$in: keywords}},
                    {tags: {$in: keywords}},
                    {vndbId: {$in: keywords}}
                ]
            }
        ]
    }
    const data = await GameModel.find(searchQuery)
        .sort({time: -1})
        .skip(skip)
        .limit(limit)
        .lean()
    return await Promise.all(
        data.map(async (game) => {
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

export async function searchUser(name: string, skip: number, limit: number) {
    const regex = new RegExp(name, 'i')
    const users = await UserModel.find({name: regex})
        .sort({time: -1})
        .skip(skip)
        .limit(limit)
        .lean()
    return users.map(user => ({
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        time: user.time,
        bio: user.bio,
        point: user.point
    }) as SearchResultUser)
}

export async function searchReply(content: string, skip: number, limit: number) {
    const regex = new RegExp(content, 'i')
    const replies = await ReplyModel.find({content: regex})
        .sort({time: -1})
        .skip(skip)
        .limit(limit)
        .populate('topic', 'title', TopicModel)
        .populate('rUser', 'uid avatar name', UserModel)
        .populate('toUser', 'uid avatar name', UserModel)
        .lean()
    return replies.map(reply => ({
        tid: reply.tid,
        title: reply.topic[0].title,
        content: reply.content.slice(0, 233),
        user: {
            uid: reply.rUser[0].uid,
            avatar: reply.rUser[0].avatar,
            name: reply.rUser[0].name
        },
        toUser: {
            uid: reply.toUser[0].uid,
            avatar: reply.toUser[0].avatar,
            name: reply.toUser[0].name
        },
        time: reply.time
    }) as SearchResultReply)
}

export async function searchComment(content: string, skip: number, limit: number) {
    const regex = new RegExp(content, 'i')
    const comments = await CommentModel.find({content: regex})
        .sort({time: -1})
        .skip(skip)
        .limit(limit)
        .populate('topic', 'title', TopicModel)
        .populate('cUser', 'uid avatar name', UserModel)
        .populate('toUser', 'uid avatar name', UserModel)
        .lean()

    return comments.map(comment => ({
        tid: comment.tid,
        title: comment.topic[0].title,
        content: comment.content.slice(0, 233),
        user: {
            uid: comment.cUser[0].uid,
            avatar: comment.cUser[0].avatar,
            name: comment.cUser[0].name
        },
        toUser: {
            uid: comment.toUser[0].uid,
            avatar: comment.toUser[0].avatar,
            name: comment.toUser[0].name
        },
        time: new Date(comment.created).getTime()
    }) as SearchResultComment)
}