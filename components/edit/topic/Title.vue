<script setup lang="ts">
import {useTempEditStore} from "~/store/temp/edit/edit";
import {usePersistEditTopicStore} from "~/store/modules/edit/edit";
const {t} = useI18n()

const tempEdit = useTempEditStore()
const persistEdit = usePersistEditTopicStore()

const topicTitle = ref('')
const maxInputLength = 40

if (tempEdit.isTopicRewriting) {
  topicTitle.value = tempEdit.title
} else {
  topicTitle.value = persistEdit.title
}

const handleInput = debounce(() => {
  if (topicTitle.value.length > maxInputLength) {
    topicTitle.value = topicTitle.value.slice(0, maxInputLength)
  }
  if (!topicTitle.value.trim()) {
    tempEdit.title = ''
    persistEdit.title = ''
    return
  }
  if (tempEdit.isTopicRewriting) {
    tempEdit.title = topicTitle.value
  } else {
    persistEdit.title = topicTitle.value
  }
}, 1000)
</script>

<template>
  <div class="title">
    <input type="text" :placeholder="t('edit.topic.title')" v-model="topicTitle" @input="handleInput"
           :maxlength="maxInputLength">
  </div>
</template>

<style scoped lang="scss">
.title {
  padding: 10px;
  width: 100%;

  input {
    background-color: var(--yzforum-trans-white-9);
    color: var(--yzforum-font-color-2);
    padding: 8px;
    width: 100%;
    font-size: 40px;
    border: none;
  }
}
</style>