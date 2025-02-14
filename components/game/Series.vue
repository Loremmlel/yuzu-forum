<script setup lang="ts">
const route = useRoute()
const {locale, t} = useI18n()

const gid = ref(route.params.gid as string)

const {data, status} = await useLazyFetch(`/api/game/${gid.value}/series`, {
  method: 'GET',
  watch: false,
  ...yzforumResponseHandler
})
</script>

<template>
  <div class="container">
    <YuzuHeader :size="2" :show-help="true">
      <template #header>
        {{ t('game.series.name') }}
      </template>
      <template #help>
        {{ t('game.series.help') }}
      </template>
    </YuzuHeader>

    <div class="games" v-if="data && status === 'success'">
      <NuxtLink v-for="(link, index) in data" :key="index" :to="`/game/${link.gid}`">
        {{ getPreferredLanguageText(link.name, locale) }}
      </NuxtLink>
    </div>
    <YuzuSkeletonGameLink v-if="status === 'pending'"></YuzuSkeletonGameLink>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.games {
  margin-bottom: 20px;

  a {
    margin-right: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--yzforum-blue-5);
    border-bottom: 2px solid transparent;

    &:hover {
      border-bottom: 2px solid var(--yzforum-blue-5);
    }
  }
}
</style>