import {TopicModel} from "~/server/models/topic";
import {UserModel} from "~/server/models/user";
import {TopicDetail} from "~/types/api/topic";
import {markdownToHtml} from "~/server/utils/markdown";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const tid = getRouterParam(event, 'tid')
    if (!tid) {
        return yuzuError(event, ErrorCode.TopicIdReadFailed)
    }

    const topic = await TopicModel.findOneAndUpdate(
        {tid},
        {$inc: {views: 1}}
    )
        .populate('user', 'uid name avatar point', UserModel)
        .lean()
    if (!topic) {
        return yuzuError(event, ErrorCode.TopicNotFound)
    }
    if (topic.status === 1) {
        return 'banned'
    }

    const userInfo = await getCookieTokenInfo(event)
    const uid = userInfo?.uid ?? 0

    return {
        tid: topic.tid,
        title: topic.title,
        views: topic.views,
        likes: {
            count: topic.likes.length,
            isLiked: topic.likes.includes(uid)
        },
        dislikes: {
            count: topic.dislikes.length,
            isDisliked: topic.dislikes.includes(uid)
        },
        favorites: {
            count: topic.favorites.length,
            isFavorite: topic.favorites.includes(uid)
        },
        time: new Date(topic.created).getTime(),
        content: await markdownToHtml(topic.content),
        markdown: topic.content,
        upvotes: {
            count: topic.upvotes.length,
            isUpvoted: topic.upvotes.includes(uid)
        },
        tags: topic.tags,
        edited: topic.edited,
        user: {
            uid: topic.user[0].uid,
            name: topic.user[0].name,
            avatar: topic.user[0].avatar,
            point: topic.user[0].point
        },
        replies: topic.replies,
        status: topic.status,
        share: topic.share,
        category: topic.category,
        section: topic.section,
        upvoteTime: topic.upvoteTime
    } as TopicDetail
})