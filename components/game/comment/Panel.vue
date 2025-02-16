<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const props = defineProps<{ refresh: () => Promise<unknown> }>()

const emits = defineEmits<{ close: [] }>()

const gameResourceStore = useTempGameResourceStore()
const route = useRoute()

const content = ref('')
const gid = ref(route.params.gid as string)
const isPublishing = ref(false)

async function handlePublishComment() {
  if (!content.value.trim()) {
    useMessage(InfoCode.EmptyCommentContent, 'warn')
    return
  }
  if (content.value.trim().length > 1007) {
    useMessage(InfoCode.CommentContentLimit, 'warn')
    return
  }

  isPublishing.value = true
  const result = await $fetch(`/api/game/${gid.value}/comment`, {
    method: 'POST',
    body: {toUid: gameResourceStore.commentToUid, content: content.value},
    watch: false,
    ...yzforumResponseHandler
  })
  isPublishing.value = false

  if (result) {
    content.value = ''
    useMessage(InfoCode.GameCommentPublishSuccess, 'success')
    emits('close')
    await props.refresh()
  }
}
</script>

<template>
  <div class="panel">
    <YuzuTextarea v-model="content" name="comment" placeholder="快来写下评论吧~" rows="5"></YuzuTextarea>

    <div class="footer">
      <slot></slot>
      <YuzuButton :pending="isPublishing" @click="handlePublishComment">
        {{ t('game.comment.publish') }}
      </YuzuButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  margin-bottom: 20px;

  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .yuzu-button {
      margin-left: auto;
    }
  }
}
</style>