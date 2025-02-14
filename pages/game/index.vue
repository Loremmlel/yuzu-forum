<script lang="ts" setup>
const {t} = useI18n()

useHead({
  title: `${t('seo.game.title')} - 柚子游戏`,
  meta: [
    {
      name: 'description',
      content: t('seo.game.description')
    }
  ]
})
</script>

<template>
  <div class="root">
    <GameCardNav></GameCardNav>
    <GameCardContainer></GameCardContainer>
  </div>
</template>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 80rem;
  margin: 0 auto;
  color: var(--yzforum-font-color-3);
}
</style>