<script lang="ts" setup>
import type {EditCreateTopicRequestData, EditUpdateTopicRequestData} from "~/types/api/topic";
import {markdownToText} from "~/utils/markdownToText";
import {InfoCode} from "~/code&message/infoCode";
import {iconMap} from "~/components/edit/utils/category";

const {t} = useI18n()

const localePath = useLocalePath()
const {
  tid,
  title: rewriteTitle,
  content: rewriteContent,
  tags: rewriteTags,
  category: rewriteCategory,
  section: rewriteSection,
  textCount: rewriteTextCount,
  isTopicRewriting
} = storeToRefs(useTempEditStore())

const {
  textCount,
  title,
  content,
  tags,
  category,
  section: editSection
} = storeToRefs(usePersistEditTopicStore())

const isPublishing = ref(false)
const sections = isTopicRewriting.value ? rewriteSection : editSection

function checkTopicPublish(
    textCount: number,
    topicData: EditCreateTopicRequestData | EditUpdateTopicRequestData) {
  const isEditUpdateTopicData = (data: any): data is EditUpdateTopicRequestData =>
      typeof data.tid !== 'undefined'
  if (isEditUpdateTopicData(topicData)) {
    if (!topicData.tid) {
      useMessage(InfoCode.InvalidTopicId, 'error')
      return false
    }
  }
  if (!topicData.title.trim()) {
    useMessage(InfoCode.EmptyTitle, 'warn')
    return false
  }
  if (topicData.title.trim().length > 40) {
    useMessage(InfoCode.TitleLengthExceeded, 'warn')
    return false
  }
  // 解决code模式和preview模式冲突
  if (!textCount && !markdownToText(topicData.content).length) {
    useMessage(InfoCode.EmptyContent, 'warn')
    return false
  }
  if (textCount > 100007 || markdownToText(topicData.content).length > 100007) {
    useMessage(InfoCode.ContentLengthExceeded, 'warn')
    return false
  }
  if (!topicData.tags.length) {
    useMessage(InfoCode.MinTagsRequired, 'warn')
    return false
  }
  if (topicData.tags.length > 7) {
    useMessage(InfoCode.MaxTagsExceededTopic, 'warn')
    return false
  }
  for (const tag of topicData.tags) {
    if (tag.length > 17) {
      useMessage(InfoCode.TagLengthExceeded, 'warn')
      return false
    }
  }
  if (!topicData.category.length) {
    useMessage(InfoCode.CategoryRequired, 'warn')
    return false
  }
  if (topicData.category.length > 2) {
    useMessage(InfoCode.MaxCategoriesExceeded, 'warn')
    return false
  }
  if (!topicData.section.length) {
    useMessage(InfoCode.SectionRequired, 'warn')
    return false
  }
  if (topicData.category.length > 2) {
    useMessage(InfoCode.MaxSectionsExceeded, 'warn')
    return false
  }
  return true
}

async function handlePublish() {
  const requestData: EditCreateTopicRequestData = {
    title: title.value,
    content: content.value,
    time: Date.now().toString(),
    tags: tags.value,
    category: category.value,
    section: editSection.value
  }
  if (!checkTopicPublish(textCount.value, requestData)) {
    return
  }

  const res = await useComponentMessageStore().alert({
    'en-us': 'Confirm to Publish?',
    'ja-jp': '公開を確定しますか？',
    'zh-cn': '确定发布吗?'
  })
  if (!res) {
    return
  }

  if (isPublishing.value) {
    return
  } else {
    isPublishing.value = true
    useMessage(InfoCode.Publishing, 'info')
  }
  const tid = await $fetch('/api/topic', {
    method: 'POST',
    body: requestData,
    watch: false,
    ...yzforumResponseHandler
  })
  isPublishing.value = false

  if (tid) {
    navigateTo(localePath(`/topic/${tid}`))
    useComponentMessageStore().info(t('AlertInfo.edit.publishSuccess'))
    usePersistEditTopicStore().resetTopicData()
  }
}

async function handleRewrite() {
  const requestData: EditUpdateTopicRequestData = {
    tid: tid.value,
    title: rewriteTitle.value,
    content: rewriteContent.value,
    tags: rewriteTags.value,
    category: rewriteCategory.value,
    section: rewriteSection.value,
    edited: Date.now().toString()
  }
  if (!checkTopicPublish(rewriteTextCount.value, requestData)) {
    return
  }
  const res = await useComponentMessageStore().alert({
    'en-us': 'Confirm to Rewrite?',
    'ja-jp': 'リライトしますか？',
    'zh-cn': '确定 Rewrite 吗?'
  })
  if (!res) {
    return
  }
  if (isPublishing.value) {
    return
  } else {
    isPublishing.value = true
    useMessage(InfoCode.Publishing, 'info')
  }
  const result = await $fetch(`/api/topic/${tid.value}`, {
    method: 'PUT',
    body: requestData,
    watch: false,
    ...yzforumResponseHandler
  })
  isPublishing.value = false

  if (result) {
    navigateTo(localePath(`/topic/${tid.value}`))
    useComponentMessageStore().info(t('AlertInfo.edit.rewriteSuccess'))
    useTempEditStore().resetRewriteTopicData()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.ctrlKey && event.key === 'Enter') {
    if (!isTopicRewriting.value) {
      handlePublish()
    } else {
      handleRewrite()
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="button-container">
    <div class="section">
      <Icon class="icon" name="lucide:layout-grid"></Icon>
      <p v-for="(section, index) in sections" :key="index">
        <Icon :name="iconMap[section[0]]" class="icon"></Icon>
        <span>{{ t(`edit.topic.section.${section}`) }}</span>
      </p>
    </div>

    <YuzuButton v-if="!isTopicRewriting" :disabled="isPublishing" class="confirm-button" @click="handlePublish">
      {{ t('edit.topic.publish') }}
    </YuzuButton>

    <YuzuButton v-else class="rewrite-button" @click="handleRewrite">
      {{ t('edit.topic.rewrite') }}
    </YuzuButton>
  </div>
</template>

<style lang="scss" scoped>
.button-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    height: 40px;
    width: 200px;
    font-size: 18px;
    white-space: nowrap;
    flex-shrink: 0;
  }
}

.section {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  color: var(--yzforum-font-color-1);

  .icon {
    font-size: 20px;
    margin-right: 10px;
  }

  p {
    margin: 4px;
    padding: 4px 20px;
    background-color: var(--yzforum-trans-blue-0);
    border: 1px solid var(--yzforum-blue-5);
    color: var(--yzforum-blue-5);
    border-radius: 8px;
    display: flex;
    align-items: center;
    user-select: none;
  }
}

@media (max-width: 700px) {
  .button-container {
    flex-direction: column;
    align-items: initial;

    button {
      width: 150px;
      margin: auto;
    }
  }

  .section {
    margin-bottom: 25px;
  }
}
</style>