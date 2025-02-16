import type {Message} from "~/types/api/message";

const messageTemplates: Record<string, Record<string, string>> = {
    'en-us': {
        upvoted: ' upvoted you!',
        liked: ' liked you!',
        favorite: ' favorite you!',
        replied: ' replied you!',
        commented: ' commented you!',
        expired: ' report for your resource link has expired!',
        requested: ' has requested an update from you!',
        merged: 'Your update request has been merged by the !',
        declined: 'Your update request declined by the !',
        admin: 'System message',
        mentioned: ' mentioned you!',
        default: ' {{action}} you!'
    },
    'ja-jp': {
        upvoted: ' があなたを推しました！',
        liked: ' があなたに「いいね！」をしました！',
        favorite: ' があなたをお気に入りに追加しました！',
        replied: ' があなたに返信しました！',
        commented: ' があなたにコメントしました！',
        expired: ' があなたのリソースリンクの期限切れを報告しました！',
        requested: ' があなたに更新リクエストを送信しました！',
        merged: 'あなたの更新リクエストが  によってマージされました！',
        declined: 'あなたの更新リクエストが  によって拒否されました！',
        admin: 'システムメッセージ',
        mentioned: ' があなたをメンションしました！',
        default: 'があなたを{{action}}しました!'
    },
    'zh-cn': {
        upvoted: ' 推了您!',
        liked: ' 点赞了您!',
        favorite: ' 收藏了您!',
        replied: ' 回复了您!',
        commented: ' 评论了您!',
        expired: ' 报告了您的资源链接已过期！',
        requested: ' 向您提出更新请求！',
        merged: '您的更新请求已被  合并！',
        declined: '您的更新请求被  拒绝！',
        admin: '系统消息',
        mentioned: ' 提到了您！',
        default: ' {{action}} 你!'
    }
}

function getMessageContent(locale: Language, message: Message): string {
    return messageTemplates[locale][message.type] || messageTemplates[locale].default
}

export function getMessageI18n(locale: Language, message: Message) {
    if (message.type === 'admin') {
        return messageTemplates[locale].admin
    }
    return getMessageContent(locale, message)
}