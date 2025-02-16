<script lang="ts" setup>
import type {TopicReply} from "~/types/api/topicReply";
import {InfoCode} from "~/code&message/infoCode";

defineProps<{
  title: string
  reply: TopicReply
}>()

const userStore = usePersistUserStore()
const tempCommentStore = useTempCommentStore()

function handleClickComment(replyRid: number, uid: number, name: string) {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToComment, 'warn', 5000)
    return
  }

  tempCommentStore.rid = replyRid
  tempCommentStore.toUid = uid
  tempCommentStore.toUsername = name
  tempCommentStore.showPanel = !tempCommentStore.showPanel
}
</script>

<template>
  <div class="footer">
    <div class="left">
      <TopicFooterUpvote
          v-tooltip="{
          message: {
            'en-us': 'Upvote',
            'ja-jp': '推す',
            'zh-cn': '推'
          },
          position: 'bottom'
        }"
          :is-upvoted="reply.upvotes.isUpvoted"
          :rid="reply.rid"
          :to-uid="reply.user.uid"
          :upvote-count="reply.upvotes.count"></TopicFooterUpvote>

      <TopicFooterLike
          v-tooltip="{
          message: {
            'en-us': 'Like',
            'ja-jp': 'いいね',
            'zh-cn': '点赞'
          },
          position: 'bottom'
        }"
          :is-liked="reply.likes.isLiked"
          :likes-count="reply.likes.count"
          :rid="reply.rid"
          :to-uid="reply.user.uid"></TopicFooterLike>

      <TopicFooterDislike
          v-tooltip="{
          message: {
            'en-us': 'Dislike',
            'ja-jp': '低評価',
            'zh-cn': '点踩'
          },
          position: 'bottom'
        }"
          :dislikes-count="reply.dislikes.count"
          :is-disliked="reply.dislikes.isDisliked"
          :rid="reply.rid"
          :to-uid="reply.user.uid"></TopicFooterDislike>
    </div>

    <div class="right">
      <TopicFooterReply :to-floor="reply.floor" :to-uid="reply.user.uid"
                        :to-username="reply.user.name"></TopicFooterReply>

      <span v-tooltip="{
        message: {
            'en-us': 'Share',
            'ja-jp': '共有',
            'zh-cn': '分享'
          },
          position: 'bottom'
      }"
            class="icon" @click="useYuzuCopy(
              `${title}: ${useRuntimeConfig().public.YZFORUM_URL}/topic/${reply.tid}#k${reply.floor}`)">
        <Icon class="icon" name="lucide:share-2"></Icon>
      </span>

      <TopicReplyRewrite v-tooltip="{message: 'Rewrite',position: 'bottom'}" :reply="reply"></TopicReplyRewrite>
      <span v-tooltip="{
        message: {
            'en-us': 'Comment',
            'ja-jp': 'コメント',
            'zh-cn': '评论',
          },
          position: 'bottom'}" class="comment" @click="handleClickComment(reply.rid, reply.user.uid, reply.user.name)">
        <Icon class="icon" name="uil:comment-dots"></Icon>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  padding: 20px 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--yzforum-font-color-3);

  span {
    display: flex;
    margin-right: 20px;
  }
}

.icon {
  font-size: 24px;
  color: var(--yzforum-font-color-2);
  cursor: pointer;
}

.right {
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    display: flex;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.active {
  color: var(--yzforum-blue-5);
}

@media (max-width: 700px) {
  .icon {
    font-size: initial;
  }
}
</style>