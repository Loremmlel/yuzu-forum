<script setup lang="ts">
import type {TopicDetail} from "~/types/api/topic";
import type {TopicReply} from "~/types/api/topicReply";
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const props = defineProps<{
  tid: string,
  topic: TopicDetail
}>()

const tempReply = useTempReplyStore()

const replyData = ref<TopicReply[] | null>(null)
const loadComplete = ref(false)
const pageData = reactive({
  page: 1,
  limit: 30,
  sortOrder: 'asc' as YuzuOrder
})

const {data, status, refresh} = await useFetch(`/api/topic/${props.tid}/reply`, {
  method: 'GET',
  query: pageData,
  watch: false,
  ...yzforumResponseHandler
})
replyData.value = data.value

const scrollPage = throttle((rid: number) => {
  let timeout: NodeJS.Timeout | null = null
  const child = document.querySelector(`#k${rid}`) as HTMLElement

  if (child) {
    child.scrollIntoView({behavior: 'smooth', block: 'center'})
    child.classList.add('active')
    if (timeout != null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      child.classList.remove('active')
    }, 3000)
  } else {
    useMessage(InfoCode.ReplyNotFound, 'info')
  }
}, 1000)


watch(
    () => tempReply.tempReply[0],
    async () => {
      if (tempReply.tempReply[0]) {
        replyData.value?.push(tempReply.tempReply[0])
        await nextTick()
        scrollPage(tempReply.tempReply[0].floor)
        tempReply.tempReply = []
      }
    }
)

watch(
    () => [pageData.page, pageData.sortOrder],
    async (newValue, oldValue) => {
      if (newValue[1] !== oldValue[1]) {
        pageData.page = 1
        loadComplete.value = false
      }
      if (status.value === 'pending') {
        return
      }
      await refresh()
      if (!data.value) {
        return
      }
      if (newValue[0] !== oldValue[0]) {
        replyData.value = replyData.value?.concat(data.value) ?? null
      } else if (newValue[1] !== oldValue[1]) {
        replyData.value = data.value
      }
      if (data.value.length < pageData.limit) {
        loadComplete.value = true
      }
    }
)
</script>

<template>
  <div class="content">
    <TopicMaster :topic="topic"></TopicMaster>

    <TopicTool v-if="replyData" :reply-data="replyData" :pending="status === 'pending'"
               :sort-order="pageData.sortOrder" @set-sort-order="(value) => pageData.sortOrder = value"></TopicTool>

    <template v-if="replyData">
      <TopicReply v-for="reply in replyData" :key="reply.rid" :reply="reply"
                  :title="topic.title" @scroll-page="(value) => scrollPage(value)"></TopicReply>
    </template>

    <YuzuDivider v-if="replyData && replyData.length >= pageData.limit" margin="30px" padding="0 17px">
      <slot></slot>
      <span class="loader" v-if="status !== 'pending' && !loadComplete" @click="pageData.page++">
        {{ t('search.load') }}
      </span>
      <span v-if="status === 'pending'">
        {{ t('search.loading') }}
      </span>
      <span v-if="loadComplete">
        {{ t('search.complete') }}
      </span>
    </YuzuDivider>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  padding: 10px;
  margin-bottom: 20px;

  @include yz-blur;
}

.yuzu-divider {
  font-size: 16px;

  span {
    &:first-child {
      padding-left: 20px;
    }

    &:last-child {
      padding-right: 20px;
    }
  }

  .loader {
    cursor: pointer;

    &:hover {
      color: var(--yzforum-blue-5);
    }
  }
}

@media (max-width: 700px) {
  .content {
    padding: 0 5px;
  }
}
</style>