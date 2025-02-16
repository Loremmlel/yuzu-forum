<script lang="ts" setup>
import type {GamePR} from "~/types/api/gamePR";

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
  <div v-if="data && data.prs.length" class="container">
    <YuzuHeader :show-help="true" :size="2">
      <template #header>
        {{ t('game.pr.name') }}
      </template>
      <template #help>
        {{ t('game.pr.help') }}
      </template>
    </YuzuHeader>

    <div v-if="status === 'success'">
      <GamePrInfo v-for="(pr, index) in data.prs" :key="index" :gid="gid" :pr="pr as GamePR"
                  :refresh="refresh" :status="status"></GamePrInfo>
    </div>
    <YuzuSkeletonGameResource v-if="status === 'pending'"></YuzuSkeletonGameResource>
    <YuzuPagination v-if="data.totalCount > 7" :limit="pageData.limit"
                    :page="pageData.page" :status="status" :sum="data.totalCount"
                    class="pagination" @set-page="(newPage) => pageData.page = newPage"></YuzuPagination>
  </div>
</template>

<style lang="scss" scoped>

</style>