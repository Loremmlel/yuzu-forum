<script lang="ts" setup>
import type {TopicComment} from "~/types/api/topicComment";
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{
  comment: TopicComment
}>()

const userStore = usePersistUserStore()
const isLiked = ref(props.comment.likes.isLiked)
const likesCount = ref(props.comment.likes.count)

async function likeComment() {
  if (isLiked.value) {
    useMessage(InfoCode.AlreadyLikedComment, 'warn')
    return
  }

  if (userStore.uid === props.comment.user.uid) {
    useMessage(InfoCode.SelfLikeDisallowed, 'warn')
    return
  }

  const result = await $fetch(`/api/topic/${props.comment.tid}/comment/like`, {
    method: 'PUT',
    query: {cid: props.comment.cid},
    watch: false,
    ...yzforumResponseHandler
  })
  if (result) {
    likesCount.value++
    isLiked.value = true
    useMessage(InfoCode.LikeSuccess, 'success')
  }
}

async function handleClickLike() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToVote, 'warn', 5000)
    return
  }
  await likeComment()
}
</script>

<template>
  <span :class="isLiked ? 'active' : ''" class="like" @click="handleClickLike">
    <Icon class="icon" name="lucide:thumbs-up"></Icon>
    <span v-if="likesCount">{{ likesCount }}</span>
  </span>
</template>

<style lang="scss" scoped>
.like {
  @include yz-center;
  margin-right: 10px;

  .icon {
    cursor: pointer;
    color: var(--yzforum-font-color-2);
    margin-right: 3px;
  }
}

.active .icon {
  color: var(--yzforum-red-4);
}
</style>