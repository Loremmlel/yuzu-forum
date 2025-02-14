<script setup lang="ts">
const {t} = useI18n()

const route = useRoute()
const gid = ref(route.params.gid as string)

const pageData = reactive({
  page: 1,
  limit: 7
})

const {data, status, refresh} = await useLazyFetch(`/api/game/${gid.value}/pr/all`, {
      method: 'GET',
      query: pageData,
      ...yzforumResponseHandler
    }
)
</script>

<template>
  <div class="container" v-if="data && data.prs.length">
    <YuzuHeader :size="2" :show-help="true">
      <template #header>
        {{ t('game.pr.name') }}
      </template>
      <template #help>
        {{ t('game.pr.help') }}
      </template>
    </YuzuHeader>

    <div v-if="status === 'success'">
      <GamePrInfo v-for="(pr, index) in data.prs" :key="index" :gid="gid" :pr="pr"
                  :status="status" :refresh="refresh"></GamePrInfo>
    </div>
    <YuzuSkeletonGameResource v-if="status === 'pending'"></YuzuSkeletonGameResource>
    <YuzuPagination class="pagination" v-if="data.totalCount > 7"
                    :page="pageData.page" :limit="pageData.limit" :sum="data.totalCount"
                    :status="status" @set-page="(newPage) => pageData.page = newPage"></YuzuPagination>
  </div>
</template>

<style scoped lang="scss">

</style>