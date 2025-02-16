<script lang="ts" setup>
import {useTempEditStore} from "~/store/temp/edit/edit";

definePageMeta({
  middleware: 'auth'
})

const {t} = useI18n()

const content = ref<HTMLElement | null>(null)
const edit = useTempEditStore()

useHead({
  title: t('seo.edit.title'),
  meta: [
    {
      name: 'description',
      content: t('seo.edit.description')
    }
  ]
})

onBeforeRouteLeave(async (_, __, next) => {
  if (!edit.isTopicRewriting) {
    next()
    return
  }
  const res = await useComponentMessageStore().alert({
    'en-us': 'Confirm leaving the page? Your changes will not be saved.',
    'ja-jp': 'ページを離れてもよろしいですか？変更は保存されません。',
    'zh-cn': '确认离开界面吗？您的更改将不会保存。'
  })
  if (res) {
    edit.resetRewriteTopicData()
    next()
  } else {
    next(false)
  }
})
</script>

<template>
  <div class="root">
    <div class="container">
      <div ref="content" class="content">
        <ClientOnly>
          <EditTopicTitle></EditTopicTitle>
          <EditTopicEditor :is-show-menu="true"></EditTopicEditor>
          <EditTopicFooter></EditTopicFooter>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.root {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.container {
  position: relative;
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;

  @include yz-blur;
}

.yuzu-footer {
  margin: 18px 0;
}
</style>