<script lang="ts" setup>
import type {PoolTopic} from "~/types/api/pool";
import {useTempPoolPageStore} from "~/store/temp/topic/pool";

const {t} = useI18n()

const pageStore = useTempPoolPageStore()

const isFetching = ref(false)
const savedPosition = ref(0)

if (pageStore.topics.length === 0) {
  pageStore.topics = await getTopics()
}

async function getTopics() {
  const result = await $fetch('/api/pool/topic', {
    method: 'GET',
    query: pageStore.data(),
    watch: false,
    ...yzforumResponseHandler
  })
  return result as PoolTopic[]
}

function isScrollAtBottom() {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop || window.scrollY
  const clientHeight = document.documentElement.clientHeight || window.innerHeight
  savedPosition.value = scrollTop
  const errorMargin = 500
  return Math.abs(scrollHeight - scrollTop - clientHeight) < errorMargin
}

async function scrollHandler() {
  if (!isScrollAtBottom() || pageStore.loadingComplete || isFetching.value) {
    return
  }
  isFetching.value = true
  pageStore.page++
  const newData = await getTopics()

  if (newData.length < pageStore.limit) {
    pageStore.loadingComplete = true
  }
  pageStore.topics = pageStore.topics.concat(newData)
  isFetching.value = false
}

watch(
    () => [pageStore.sortField, pageStore.sortOrder, pageStore.category],
    async () => {
      pageStore.page = 1
      pageStore.loadingComplete = false
      pageStore.topics = []
      savedPosition.value = 0
      pageStore.topics = await getTopics()
    }
)

async function handleLoadTopics() {
  if (pageStore.loadingComplete) {
    return
  }
  pageStore.page++
  const lazyLoadTopics = await getTopics()
  if (lazyLoadTopics.length < pageStore.limit) {
    pageStore.loadingComplete = true
  }
  pageStore.topics = pageStore.topics.concat(lazyLoadTopics)
}

onMounted(() => {
  window.scrollTo({
    top: savedPosition.value
  })
  window.addEventListener('scroll', scrollHandler)
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<template>
  <div class="pool">
    <PoolTool></PoolTool>
    <PoolLayout :topics="pageStore.topics"></PoolLayout>
    <div class="load">
      <span v-if="!pageStore.loadingComplete" class="loader" @click="handleLoadTopics">
        {{ t('pool.load') }}
      </span>
      <span v-else class="complete">
        {{ t('pool.complete') }}
      </span>
    </div>
    <YuzuFooter></YuzuFooter>
  </div>
</template>

<style lang="scss" scoped>
.pool {
  display: flex;
  flex-direction: column;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 10px;
}

.load {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin: 24px 0;

  .loader {
    cursor: pointer;
    color: var(--yzforum-font-color-1);

    &:hover {
      color: var(--yzforum-blue-5);
    }
  }

  .complete {
    color: var(--yzforum-trans-blue-2);
    user-select: none;
    cursor: default;
  }
}

.yuzu-footer {
  margin-bottom: 20px;
}

@media (max-width: 700px) {
  .pool {
    padding: 0 5px;
  }
}
</style>