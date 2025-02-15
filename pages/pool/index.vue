<script lang="ts" setup>
const {t} = useI18n()

useHead({
  title: `${t('seo.pool.title')} - 柚子游戏`,
  meta: [
    {
      name: "description",
      content: t('seo.pool.description')
    }
  ]
})
</script>

<template>
  <PoolContainer></PoolContainer>
</template>

<style lang="scss" scoped>

</style>