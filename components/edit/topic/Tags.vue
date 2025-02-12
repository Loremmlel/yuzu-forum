<script setup lang="ts">
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()
const route = useRoute()
const getRouteBaseName = useRouteBaseName()
const baseRouteName = computed(() => {
  return getRouteBaseName(route)
})

const tempEdit = useTempEditStore()
const persistEdit = usePersistEditTopicStore()
const tempReply = useTempReplyStore()
const persistReply = usePersistYzforumReplyStore()

const selectedTags = ref<string[]>([])
const isInputFocus = ref(false)
const inputValue = ref('')
const canDeleteTag = ref(false)

if (baseRouteName.value === 'edit-topic') {
  if (tempEdit.isTopicRewriting) {
    selectedTags.value = tempEdit.tags
  } else {
    selectedTags.value = persistEdit.tags
  }
}

if (baseRouteName.value === 'topic-tid') {
  if (tempReply.isReplyRewriting) {
    selectedTags.value = tempReply.replyRewrite[0].tags
  } else {
    selectedTags.value = persistReply.replyDraft.tags
  }
}

function handleTagClose(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
}

function handleAddTag() {
  const tagName = inputValue.value.trim().slice(0, 17)
  const isIncludes = selectedTags.value.map((item) => item.toLowerCase()).includes(tagName.toLowerCase())
  if (isIncludes) {
    useMessage(InfoCode.TagAlreadyExists, 'warn')
    return
  }

  if (tagName.length > 0 && selectedTags.value.length < 7) {
    const tag = validateTagName(tagName)
    selectedTags.value.push(tag)
    inputValue.value = ''
    canDeleteTag.value = true
  }
}

function handleRemoveTag() {
  if (inputValue.value === '' && selectedTags.value.length > 0) {
    if (canDeleteTag.value) {
      selectedTags.value.pop()
    }
    canDeleteTag.value = true
  }
}

function validateTagName(tagName: string) {
  let validatedName = tagName.trim()
  if (tagName.length > 17) {
    validatedName = tagName.slice(0, 17)
  }
  return validatedName
}

watch(
    () => selectedTags.value,
    () => {
      if (baseRouteName.value === 'topic-tid' && !tempReply.isReplyRewriting) {
        persistReply.replyDraft.tags = selectedTags.value
      }
      if (baseRouteName.value === 'edit-topic' && !tempReply.isReplyRewriting) {
        persistEdit.tags = selectedTags.value
      }
    }
)
</script>

<template>
  <div class="container-1">
    <div class="input-container">
      <div class="tags-container">
        <span v-for="(tag, index) in selectedTags" :key="index" class="selected-tag">
          {{ tag }}
          <span class="close-button" @click="handleTagClose(tag)">×</span>
        </span>
      </div>
      <input class="input" type="text" v-model="inputValue" @keydown.enter="handleAddTag" @input="canDeleteTag = false"
             @focus="isInputFocus = true" @blur="isInputFocus = false">
      <span v-if="inputValue" class="add-tag" @click="handleAddTag">
        <Icon name="lucide:plus"></Icon>
      </span>
      <div class="box1"></div>
      <div class="box2" :class="isInputFocus ? 'box-active' : ''"></div>
    </div>
    <div class="hint">{{ t('edit.topic.hint') }}</div>
  </div>
</template>

<style scoped lang="scss">
.container-1 {
  width: 100%;
}

.input-container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;

  .tags-container {
    display: flex;
    flex-wrap: wrap;
  }

  .add-tag {
    height: 32px;
    width: 32px;
    @include yz-center;
    cursor: pointer;
    font-size: 24px;
    border-radius: 10px;
    background-color: var(--yzforum-blue-5);
    color: var(--yzforum-white);
  }
}

.selected-tag {
  border: 1px solid var(--yzforum-pink-4);
  border-radius: 14px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
  padding: 3px 17px;
  background-color: var(--yzforum-trans-pink-0);

  span {
    cursor: pointer;
  }
}

.close-button {
  margin: 0 5px;
}

.input {
  background-color: transparent;
  font-size: 17px;
  flex-grow: 1;
  border: none;
  padding: 7px;
  display: flex;
  min-width: 300px;
  color: var(--yzforum-font-color-3);
}

.box1 {
  height: 2px;
  width: 100%;
  display: flex;
  background-color: var(--yzforum-blue-0);
}

.box2 {
  position: relative;
  transform: translateY(-2px);
  transition: all 0.5s;
  height: 2px;
  width: 1px;
  display: flex;
  background-color: var(--yzforum-blue-2);
}

.box-active {
  width: 100%;
  background-color: var(--yzforum-blue-5);
}

.hint {
  font-size: small;
  color: var(--yzforum-font-color-1);
}
</style>