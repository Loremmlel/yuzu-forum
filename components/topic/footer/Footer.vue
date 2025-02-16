<script lang="ts" setup>
import type {TopicDetail} from "~/types/api/topic";

const {locale, t} = useI18n()

defineProps<{
  topic: TopicDetail
}>()
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
          :is-upvoted="topic.upvotes.isUpvoted"
          :tid="topic.tid"
          :to-uid="topic.user.uid"
          :upvote-count="topic.upvotes.count"></TopicFooterUpvote>

      <TopicFooterLike
          v-tooltip="{
          message: {
            'en-us': 'Like',
            'ja-jp': 'いいね',
            'zh-cn': '点赞'
          },
          position: 'bottom'
        }"
          :is-liked="topic.likes.isLiked"
          :likes-count="topic.likes.count"
          :tid="topic.tid"
          :to-uid="topic.user.uid"></TopicFooterLike>

      <TopicFooterDislike
          v-tooltip="{
          message: {
            'en-us': 'Dislike',
            'ja-jp': '低評価',
            'zh-cn': '点踩'
          },
          position: 'bottom'
        }"
          :dislikes-count="topic.dislikes.count"
          :is-disliked="topic.dislikes.isDisliked"
          :tid="topic.tid"
          :to-uid="topic.user.uid"></TopicFooterDislike>

      <TopicFooterFavorite
          v-tooltip="{
          message: {
            'en-us': 'Favorite',
            'ja-jp': 'お気に入り',
            'zh-cn': '收藏'
          },
          position: 'bottom'
        }"
          :favorites-count="topic.favorites.count"
          :is-favorite="topic.favorites.isFavorite"
          :tid="topic.tid"
          :to-uid="topic.user.uid"></TopicFooterFavorite>
    </div>

    <div class="right">
      <TopicFooterReply
          :tid="topic.tid"
          :to-floor="0"
          :to-uid="topic.user.uid"
          :to-username="topic.user.name"></TopicFooterReply>

      <span
          v-tooltip="{
            message: {
            'en-us': 'Share',
            'ja-jp': '共有',
            'zh-cn': '分享'
          },
          position: 'bottom'
          }"
          class="icon" @click="useYuzuCopy(
              `${topic.title}: ${useRuntimeConfig().public.YZFORUM_URL}/${locale}/topic/${topic.tid}`)">
        <Icon class="icon" name="lucide:share-2"></Icon>
      </span>

      <TopicFooterRewrite v-tooltip="{
        message: 'Rewrite',
        position: 'bottom'
      }" :topic="topic"></TopicFooterRewrite>
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

.views {
  margin-left: 20px;
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