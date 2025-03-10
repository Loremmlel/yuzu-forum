<script lang="ts" setup>
const {t} = useI18n()

useHead({
  title: `${t('seo.search.title')} - 柚子论坛`,
  meta: [
    {
      name: 'description',
      content: t('seo.search.description')
    }
  ]
})
</script>

<template>
  <div class="root">
    <SearchContainer></SearchContainer>
  </div>
</template>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100dvh - 75px);
  max-width: 80rem;
  margin: 0 auto;
  color: var(--yzforum-font-color-3);
  padding: 20px;

  @include yz-blur;
}

@media (max-width: 700px) {
  .root {
    margin: 0 5px;
    min-height: calc(100dvh - 63px);
  }
}
</style>