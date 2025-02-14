<script setup lang="ts">
const tempGameStore = useTempGameStore()

const pageData = computed(() => tempGameStore.out())

const {t} = useI18n()

const {data, status} = await useFetch('/api/game', {
  method: 'GET',
  query: pageData.value,
  ...yzforumResponseHandler
})
</script>

<template>
  <div class="container">
    <GameCard v-if="data?.gameCards" :games="data.gameCards"></GameCard>
    <div class="declaration">
      {{ t('game.declaration') }}
    </div>

    <YuzuPagination class="pagination" v-if="data?.totalCount" :page="pageData.page"
                    :limit="pageData.limit" :sum="data.totalCount" :status="status"
                    @set-page="(newPage) => tempGameStore.page= newPage"></YuzuPagination>

    <YuzuFooter></YuzuFooter>
  </div>
</template>

<style scoped lang="scss">
.declaration {
  user-select: none;
  margin-top: 16px;
  text-align: center;
  font-size: small;
  color: var(--yzforum-font-color-0);
}

@media (max-width: 700px) {
  .container {
    margin: 0 5px;
  }
}
</style>