<script lang="ts" setup>
const {t} = useI18n()

useHead({
  title: `${t('seo.report.title')} - 柚子游戏`,
  meta: [
    {
      name: 'description',
      content: t('seo.report.description')
    }
  ]
})
</script>

<template>
  <div class="root">
    <Report></Report>
  </div>
</template>

<style lang="scss" scoped>
.root {
  height: 100%;
  min-height: calc(100dvh - 75px);
}

@media (max-width: 700px) {
  .root {
    min-height: calc(100dvh - 60px);
  }
}
</style>