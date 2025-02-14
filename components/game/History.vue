<script setup lang="ts">
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

  <div class="container" v-if="data">
    <div class="history" v-for="(history, index) in data.historyData" :key="index">
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
        <div class="content" v-if="history.content">
          {{ history.content }}
        </div>
      </div>
    </div>

    <YuzuPagination class="pagination" v-if="data.totalCount > 7" :page="pageData.page"
                    :limit="pageData.limit" :sum="data.totalCount" :status="status"
                    @set-page="(newPage) => (pageData.page = newPage)"></YuzuPagination>
  </div>
</template>

<style scoped lang="scss">
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