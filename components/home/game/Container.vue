<script lang="ts" setup>
import type {HomeGame} from "~/types/api/home";

const {t} = useI18n()

const gameData = ref<HomeGame[] | null>()
const pageData = reactive({
  page: 1,
  limit: 10
})
const {data, status} = await useFetch('/api/home/game', {
  method: 'GET',
  query: pageData,
  key: 'home-game',
  ...yzforumResponseHandler
})
gameData.value = data.value

watch(
    () => [pageData.page, status.value],
    () => {
      if (data.value && status.value == 'success' && pageData.page > 1) {
        gameData.value = gameData.value?.concat(data.value)
      }
    }
)

function handleClose() {
  gameData.value = gameData.value?.slice(0, 10)
  pageData.page = 1
}
</script>

<template>
  <div v-if="gameData" class="container">
    <div v-for="(game, index) in gameData" :key="index">
      <HomeGameCard :game="game"></HomeGameCard>
      <YuzuDivider color="var(--yzforum-trans-blue-1)" margin="0 8px"></YuzuDivider>
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
  margin-left: 17px;
  cursor: pointer;
  padding-right: 17px;

  &:hover {
    color: var(--yzforum-blue-5);
  }
}
</style>