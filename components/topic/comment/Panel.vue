<script setup lang="ts">
import type {TopicComment} from "~/types/api/topicComment";
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const props = defineProps<{ rid: number }>()

const emits = defineEmits<{ getComment: [newComment: TopicComment] }>()

const userStore = usePersistUserStore()
const tempCommentStore = useTempCommentStore()
const tid = inject<number>('tid')
const commentValue = ref('')
const publishing = ref(false)

async function handlePublishComment() {
  if (!commentValue.value.trim()) {
    useMessage(InfoCode.EmptyComment, 'warn')
    return
  }
  if (commentValue.value.trim().length > 1007) {
    useMessage(InfoCode.CommentLengthExceeded, 'warn')
    return
  }
  if (publishing.value) {
    return
  } else {
    publishing.value = true
    useMessage(InfoCode.CommentPublishing, 'info')
  }
  const comment = await $fetch(`/api/topic/${tid}/comment`, {
    method: 'POST',
    body: {
      rid: props.rid,
      toUid: tempCommentStore.toUid,
      content: commentValue.value
    },
    watch: false,
    ...yzforumResponseHandler
  })
  publishing.value = false
  if (comment) {
    emits('getComment', comment)
    useMessage(InfoCode.TopicCommentPublishSuccess, 'success')
    tempCommentStore.showPanel = false
  }
}
</script>

<template>
  <div class="panel">
    <div class="top">
      <div class="title">
        <span>{{ userStore.name }}</span>
        <span>{{ t('topic.content.comment') }}</span>
        <span>{{ tempCommentStore.toUsername }}</span>
      </div>
      <div class="confirm">
        <YuzuButton @click="handlePublishComment">
          {{ t('topic.content.publish') }}
        </YuzuButton>
        <YuzuButton @click="tempCommentStore.showPanel = false">
          {{t('topic.content.close')}}
        </YuzuButton>
      </div>
    </div>

    <YuzuTextarea name="comment" :placeholder="t('topic.content.hint')" row="5" v-model="commentValue"></YuzuTextarea>
  </div>
</template>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.top {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: var(--yzforum-font-color-3);
  padding: 10px 0;
}

.title {
  display: flex;
  flex-wrap: wrap;

  span {
    padding-bottom: 5px;

    &:nth-child(2) {
      margin: 0 5px;
    }

    &:nth-child(3) {
      cursor: pointer;
      color: var(--yzforum-blue-5);
      border-bottom: 2px solid transparent;

      &:hover {
        border-bottom: 2px solid var(--yzforum-blue-5);
      }
    }
  }
}

.confirm {
  @include yz-center;

  .yuzu-button {
    &:first-child {
      margin-right: 8px;
    }
  }
}
</style>