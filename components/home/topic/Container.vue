<script lang="ts" setup>
import type {HomeTopic} from "~/types/api/home";

const {t} = useI18n()
const topicData = ref<HomeTopic[] | null>()
const pageData = reactive({
  page: 1,
  limit: 10
})

const {data, status} = await useFetch('/api/home/topic', {
  method: 'GET',
  query: pageData,
  ...yzforumResponseHandler
})

topicData.value = data.value

watch(
    () => [pageData.page, status.value],
    () => {
      if (data.value && status.value === 'success' && pageData.page > 1) {
        topicData.value = topicData.value?.concat(data.value)
      }
    }
)

function handleClose() {
  topicData.value = topicData.value?.slice(0, 10)
  pageData.page = 1
}
</script>

<template>
  <div v-if="topicData" class="container">
    <div v-for="(topic, index) in topicData" :key="index">
      <HomeTopicCard :topic="topic"></HomeTopicCard>
      <YuzuDivider color="var(--yzforum-trans-blue-1)" margin="0 7px"></YuzuDivider>
    </div>
  </div>

  <HomeLoader v-model="pageData.page" :status="status">
    <span v-if="pageData.page !== 1" class="close" @click="handleClose">
      {{ t('home.fold') }}
    </span>
  </HomeLoader>
</template>

<style lang="scss" scoped>
.close {
  margin-left: 16px;
  cursor: pointer;
  padding-right: 16px;

  &:hover {
    color: var(--yzforum-blue-5);
  }
}
</style>