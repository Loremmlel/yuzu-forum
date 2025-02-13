<script setup lang="ts">
import {InfoCode} from "~/code&message/infoCode";

function checkReplyPublish(tags: string[], content: string) {
  if (tags.length > 7) {
    useMessage(InfoCode.ReplyMaxTags, 'warn')
    return false
  }
  for (const tag of tags) {
    if (tag.length > 17) {
      useMessage(InfoCode.ReplyTagLength, 'warn')
      return false
    }
  }
  if (!content.trim()) {
    useMessage(InfoCode.EmptyReplyContent, 'warn')
    return false
  }
  if (content.length > 10007) {
    useMessage(InfoCode.ReplyContentLimit, 'warn')
    return false
  }
  return true
}

const {t} = useI18n()

const route = useRoute()
const tid = ref<string>(route.params.tid as string)

const persistTopicStore = usePersistYzforumTopicStore()
const tempReplyStore = useTempReplyStore()
const persistReplyStore = usePersistYzforumReplyStore()

const publishing = ref(false)


async function handlePublish() {
  if (!checkReplyPublish(persistReplyStore.replyDraft.tags, persistReplyStore.replyDraft.content)) {
    return
  }

  const res = await useComponentMessageStore().alert({
    'en-us': 'Confirm to publish?',
    'ja-jp': '公開を確定しますか？',
    'zh-cn': '确认发布吗？'
  })
  if (!res) {
    return
  }

  if (publishing.value) {
    return
  } else {
    publishing.value = true
    useMessage(InfoCode.Publishing, 'info')
  }

  const reply = await $fetch(`/api/topic/${tid.value}/reply`, {
    method: 'POST',
    body: {...persistReplyStore.replyDraft, time: Date.now()},
    watch: false,
    ...yzforumResponseHandler
  })
  publishing.value = false

  if (reply) {
    tempReplyStore.isEdit = false
    tempReplyStore.tempReply.push(reply)
    persistReplyStore.resetReplyDraft()
    useMessage(InfoCode.ReplyPublishSuccess, 'success')
  }
}

async function handleRewrite() {
  if (!checkReplyPublish(tempReplyStore.replyRewrite[0].tags, tempReplyStore.replyRewrite[0].markdown)) {
    return
  }
  const res = await useComponentMessageStore().alert({
    'en-us': 'Confirm to Rewrite?',
    'ja-jp': 'リライトしますか？',
    'zh-cn': '确认 Rewrite 吗？'
  })
  if (!res) {
    return
  }

  if (publishing.value) {
    return
  } else {
    publishing.value = true
    useMessage(InfoCode.Publishing, 'info')
  }
  const result = await $fetch(`/api/topic/${tid.value}/reply`, {
    method: 'PUT',
    body: {
      rid: tempReplyStore.replyRewrite[0].rid,
      content: tempReplyStore.replyRewrite[0].markdown,
      tags: tempReplyStore.replyRewrite[0].tags,
      edited: Date.now()
    },
    watch: false,
    ...yzforumResponseHandler
  })
  publishing.value = false
  if (result) {
    useMessage(InfoCode.ReplyEditSuccess, 'success')
    tempReplyStore.resetRewriteReplyData()
    persistTopicStore.showAdvance = false
    tempReplyStore.isEdit = false
  }
}

function handleShowAdvance() {
  persistTopicStore.showAdvance = !persistTopicStore.showAdvance
}
</script>

<template>
  <div class="button-container">
    <button class="advance-button" @click="handleShowAdvance">
      {{ t('topic.panel.advance') }}
    </button>
    <button v-if="!tempReplyStore.isReplyRewriting" class="confirm-button" @click="handlePublish">
      {{ t('topic.panel.confirm') }}
    </button>
    <button v-else class="rewrite-button" @click="handleRewrite">
      {{ t('topic.panel.rewrite') }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.button-container {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  button {
    margin: 10px 0;
    height: 40px;
    width: 150px;
    font-size: 17px;
    white-space: nowrap;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;

    &:hover {
      color: var(--yzforum-white);
    }
  }
}

.confirm-button {
  color: var(--yzforum-blue-5);
  background-color: transparent;
  border: 1px solid var(--yzforum-blue-5);

  &:hover {
    background-color: var(--yzforum-blue-5);
    transition: 0.2s;
  }
}

.rewrite-button {
  color: var(--yzforum-red-4);
  background-color: transparent;
  border: 1px solid var(--yzforum-red-4);

  &:hover {
    background-color: var(--yzforum-red-4);
    transition: 0.2s;
  }
}

.advance-button {
  color: var(--yzforum-purple-4);
  background-color: transparent;
  border: 1px solid var(--yzforum-purple-4);

  &:hover {
    background-color: var(--yzforum-purple-4);
    transition: 0.2s;
  }
}

@media (max-width: 700px) {
  .button-container {
    button {
      margin: 10px 0;
      height: 35px;
      width: 130px;
      font-size: 15px;
    }
  }
}
</style>