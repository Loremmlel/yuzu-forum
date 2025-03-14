<script lang="ts" setup>
const tempGameStore = useTempGameStore()

// fix: 修复了game页面出错的问题……
// 被ws的文件搜索给骗了。我之前给useFetch加key的时候，看到这里的t是灰色的，以为没用到就给删了……
const {t} = useI18n()

const pageData = computed(() => tempGameStore.out())

const {data, status} = await useFetch('/api/game', {
  method: 'GET',
  query: pageData.value,
  key: 'game-card',
  ...yzforumResponseHandler
})
</script>

<template>
  <div class="container">
    <GameCard v-if="data?.gameCards" :games="data.gameCards"></GameCard>
    <div class="declaration">
      {{ t('game.declaration') }}
    </div>

    <YuzuPagination v-if="data?.totalCount" :limit="pageData.limit" :page="pageData.page"
                    :status="status" :sum="data.totalCount" class="pagination"
                    @set-page="(newPage) => tempGameStore.page= newPage"></YuzuPagination>

    <YuzuFooter></YuzuFooter>
  </div>
</template>

<style lang="scss" scoped>
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