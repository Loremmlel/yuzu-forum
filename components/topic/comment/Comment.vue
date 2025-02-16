<script lang="ts" setup>
import type {TopicComment} from "~/types/api/topicComment";
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const props = defineProps<{
  rid: number
  commentsData: TopicComment[]
}>()

const comments = ref(props.commentsData)
const userStore = usePersistUserStore()
const tempCommentStore = useTempCommentStore()

function handleClickComment(comment: TopicComment) {
  if (!userStore.uid) {
    useMessage(InfoCode.LoginToComment, 'warn', 5000)
    return
  }
  tempCommentStore.rid = comment.rid
  tempCommentStore.toUid = comment.user.uid
  tempCommentStore.toUsername = comment.user.name
  tempCommentStore.showPanel = !tempCommentStore.showPanel
}
</script>

<template>
  <div class="comment-container">
    <div v-if="comments?.length" class="container">
      <div class="title">
        <span>{{ t('topic.content.comments') }}</span>
      </div>

      <div v-for="(comment, index) in comments" :key="index" class="comment">
        <NuxtLink v-if="comment.user.avatar" :to="`/yzgamer/${comment.user.uid}/info`">
          <img :src="comment.user.avatar.replace(/\.webp$/, '-100.webp')" alt="柚子">
        </NuxtLink>

        <div class="content">
          <div class="describe">
            <div class="name">
              {{ `${comment.user.name} ${t('topic.content.comment')}` }}
              <NuxtLink :to="`/yzgamer/${comment.toUser.uid}/info`">
                {{ comment.toUser.name }}
              </NuxtLink>
            </div>

            <div class="operate">
              <TopicCommentLike :comment="comment"></TopicCommentLike>
              <span @click="handleClickComment(comment)">
                <Icon class="icon" name="uil:comment-dots"></Icon>
              </span>
            </div>
          </div>

          <pre class="text">{{ comment.content }}</pre>
        </div>
      </div>
    </div>

    <LazyTopicCommentPanel v-if="tempCommentStore.showPanel && rid === tempCommentStore.rid"
                           :rid="rid" @get-comment="(newComment) => comments.push(newComment)"></LazyTopicCommentPanel>
  </div>
</template>

<style lang="scss" scoped>
.title {
  border-top: 1px solid var(--yzforum-trans-blue-2);
  flex-shrink: 0;
  padding: 20px 0;
  color: var(--yzforum-font-color-3);
}

.comment-container {
  width: 100%;
  padding: 0 20px;
}

.comment {
  display: flex;
  width: 100%;
  margin: 10px 0;
  color: var(--yzforum-font-color-3);

  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.describe {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 5px;
}

.name {
  font-size: 15px;

  a {
    color: var(--yzforum-blue-5);

    &:hover {
      text-decoration: underline;
    }
  }
}

.operate {
  display: flex;

  span {
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      cursor: pointer;
      color: var(--yzforum-font-color-2);
      margin-right: 2px;
    }
  }
}

.text {
  border-left: 3px solid var(--yzforum-blue-5);
  padding-left: 10px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>