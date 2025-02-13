<script lang="ts" setup>
import type {TopicDetail} from "~/types/api/topic";

const {t} = useI18n()

const route = useRoute()

const topicStore = usePersistYzforumTopicStore()
const tempReply = useTempReplyStore()

const isBanned = ref(false)
const tid = ref<string>(route.params.tid as string)
provide<string>('tid', tid.value)

const data = await useFetch(`/api/topic/${tid.value}`, {
  method: 'GET',
  watch: false,
  ...yzforumResponseHandler
}).then(({data}) => {
  if (data.value === 'banned') {
    isBanned.value = true
    return null
  }
  return data.value as TopicDetail
})

function resetPanelStatus() {
  tempReply.isEdit = false
  topicStore.showAdvance = false
}

onBeforeRouteLeave(async (_, __, next) => {
  if (tempReply.isReplyRewriting) {
    const res = await useComponentMessageStore().alert({
      'en-us': 'Confirm leaving the page? Your changes will not be saved.',
      'ja-jp': 'ページを離れてもよろしいですか？変更は保存されません。',
      'zh-cn': '确认离开界面吗？您的更改将不会保存。'
    })
    if (res) {
      tempReply.resetRewriteReplyData()
      resetPanelStatus()
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
  resetPanelStatus()
})

onBeforeMount(() => resetPanelStatus())

function getFirstImageSrc(html: string) {
  const regex = /<img[^>]+src="([^">]+)"/i
  const match = html.match(regex)
  return match ? match[1] : 'yzforum.webp'
}

if (data) {
  const content = computed(() =>
      markdownToText(data.markdown).trim().replace(/\s+/g, ',').slice(0, 233))
  useHead({
    title: `${data.title} - 柚子游戏`,
    meta: [
      {
        name: 'description',
        content: content.value
      },
      {
        name: 'keywords',
        content: data.tags.toString()
      },
      {
        name: 'og:title',
        content: `${data.title} - 柚子游戏`
      },
      {
        name: 'og:description',
        content: content.value
      },
      {
        property: 'og:image',
        content: getFirstImageSrc(data.content)
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:url',
        content: useRequestURL().href
      },
    ]
  })
}
</script>

<template>
  <div class="root">
    <Topic v-if="data" :tid="tid" :topic="data"></Topic>
    <YuzuNull :condition="!data && !isBanned" type="404"></YuzuNull>
    <YuzuBlank v-if="isBanned">{{t('topic.banned')}}</YuzuBlank>
    
    <TopicBar></TopicBar>
  </div>
</template>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 80rem;
  margin: 0 auto;
  color: var(--yzforum-font-color-3);
}
</style>