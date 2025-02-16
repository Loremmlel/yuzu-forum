<script lang="ts" setup>
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
  <span v-if="showRewrite" class="icon" @click="rewriteReply">
    <Icon class="icon" name="lucide:pencil"></Icon>
  </span>
</template>

<style lang="scss" scoped>

</style>