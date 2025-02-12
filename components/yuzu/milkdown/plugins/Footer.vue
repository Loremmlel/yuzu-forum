<script setup lang="ts">
import {useTempReplyStore} from "~/store/temp/topic/reply";
import {usePersistYzforumReplyStore} from "~/store/modules/topic/reply";
import {usePluginViewContext} from "@prosemirror-adapter/vue";

const {t} = useI18n()

const route = useRoute()
const getRouteBaseName = useRouteBaseName()
const baseRouteName = computed(() => getRouteBaseName(route))

const tempEdit = useTempEditStore()
const persistEdit = usePersistEditTopicStore()
const tempReply = useTempReplyStore()
const persistReply = usePersistYzforumReplyStore()

const {view} = usePluginViewContext()
const size = computed(() => view.value.state.doc.textContent.length)

watch(
    () => size.value,
    () => {
      if (baseRouteName.value === 'edit-topic' && tempEdit.isTopicRewriting) {
        tempEdit.textCount = size.value
        return
      }
      if (baseRouteName.value === 'topic-tid' && tempReply.isReplyRewriting) {
        tempReply.textCount = size.value
        return
      }
      if (baseRouteName.value === 'edit-topic') {
        persistEdit.textCount = size.value
      }
      if (baseRouteName.value === 'topic-tid') {
        persistReply.textCount = size.value
      }
    }
)

onMounted(() => {
  if (baseRouteName.value === 'edit-topic' && tempEdit.isTopicRewriting) {
    tempEdit.textCount = size.value
    return
  }
  if (baseRouteName.value === 'topic-tid' && tempReply.isReplyRewriting) {
    tempReply.textCount = size.value
    return
  }
})
</script>

<template>
  <div class="footer">
    <span class="size">{{size + ` ${t('edit.topic.word')} `}}</span>
  </div>
</template>

<style scoped lang="scss">
.footer {
  padding: 10px 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.size {
  font-size: 15px;
  color: var(--yzforum-font-color-0);
}
</style>