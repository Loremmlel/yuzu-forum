<script lang="ts" setup>
import type {TopicDetail} from "~/types/api/topic";

const props = defineProps<{ topic: TopicDetail }>()

const localePath = useLocalePath()

const tempEditStore = useTempEditStore()
const userStore = usePersistUserStore()
const showRewrite = computed(() => userStore.uid === props.topic.user.uid)

function rewriteTopic() {
  tempEditStore.tid = props.topic.tid
  tempEditStore.title = props.topic.title
  // fix: 修复了重写markdown时自动填充的是html而不是markdown的错误
  tempEditStore.content = props.topic.markdown
  tempEditStore.tags = props.topic.tags
  tempEditStore.category = props.topic.category
  tempEditStore.section = props.topic.section ?? []
  tempEditStore.isTopicRewriting = true

  navigateTo(localePath('/edit/topic'))
}
</script>

<template>
  <span v-if="showRewrite" class="icon" @click="rewriteTopic">
    <Icon class="icon" name="lucide:pencil"></Icon>
  </span>
</template>

<style lang="scss" scoped>

</style>