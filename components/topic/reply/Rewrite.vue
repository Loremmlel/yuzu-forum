<script setup lang="ts">
import type {TopicReply} from "~/types/api/topicReply";
const props = defineProps<{
  reply: TopicReply
}>()

const tempReplyStore = useTempReplyStore()
const userStore = usePersistUserStore()

const showRewrite = computed(() => userStore.uid === props.reply.user.uid)

function rewriteReply() {
  tempReplyStore.replyRewrite.push(props.reply)
  tempReplyStore.isReplyRewriting = true
  tempReplyStore.isEdit = true
}
</script>

<template>
  <span v-if="showRewrite" @click="rewriteReply" class="icon">
    <Icon class="icon" name="lucide:pencil"></Icon>
  </span>
</template>

<style scoped lang="scss">

</style>