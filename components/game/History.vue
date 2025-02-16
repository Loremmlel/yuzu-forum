<script lang="ts" setup>
const route = useRoute()
const gid = ref(route.params.gid as string)
const {locale, t} = useI18n()

const pageData = reactive({
  page: 1,
  limit: 7
})

const {data, status} = await useFetch(`/api/game/${gid.value}/history/all`, {
      method: 'GET',
      query: pageData,
      ...yzforumResponseHandler
    }
)
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{ t('game.history.name') }}
    </template>
  </YuzuHeader>

  <div v-if="data" class="container">
    <div v-for="(history, index) in data.historyData" :key="index" class="history">
      <NuxtLink :to="`/yzgamer/${history.user.uid}/info`">
        <YuzuAvatar :user="history.user" size="30px"></YuzuAvatar>
      </NuxtLink>

      <div class="info">
        <div>
          <span>{{ history.user.name }}</span>
          <span>{{ t(`game.history.${history.action}`) }}</span>
          <span>{{ t(`game.history.${history.type}`) }}</span>
          <span class="time">{{ formatTimeDiff(history.time, locale) }}</span>
        </div>
        <div v-if="history.content" class="content">
          {{ history.content }}
        </div>
      </div>
    </div>

    <YuzuPagination v-if="data.totalCount > 7" :limit="pageData.limit" :page="pageData.page"
                    :status="status" :sum="data.totalCount" class="pagination"
                    @set-page="(newPage) => (pageData.page = newPage)"></YuzuPagination>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  margin-bottom: 20px;
}

.container {
  display: flex;
  flex-direction: column;
}

.history {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: small;

  .info {
    span {
      margin-left: 10px;
    }

    .time {
      color: var(--yzforum-font-color-0);
    }
  }

  .content {
    margin-left: 10px;
    margin-top: 5px;
    color: var(--yzforum-font-color-0);
  }
}
</style>