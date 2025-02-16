<script lang="ts" setup>
definePageMeta({
  layout: 'message',
  middleware: 'auth'
})

const {t} = useI18n()
const settingStore = useTempSettingStore()

useHead({
  title: `${t('seo.message.title')} - 柚子游戏`,
  meta: [
    {
      name: 'description',
      content: t('seo.message.description')
    }
  ]
})

onMounted(() => settingStore.messageStatus = 'online')
</script>

<template>
  <MessageNotice></MessageNotice>
</template>

<style lang="scss" scoped>

</style>