<script setup lang="ts">
const {t} = useI18n()

const initialImageUrl = ref('')

onMounted(async () => {
  const imageBlob = await getImage('yzforum-publish-banner')
  if (imageBlob) {
    initialImageUrl.value = URL.createObjectURL(imageBlob)
  }
})
</script>

<template>
  <YuzuHeader :size="2" :show-help="true">
    <template #header>{{ t('edit.game.banner.name') }}</template>
    <template #help>{{ t('edit.game.banner.help') }}</template>
  </YuzuHeader>
  <YuzuUpload class="upload" width="300px" :initial-image="initialImageUrl" :size="1920"
              :aspect="16 / 9" :hint="t('edit.game.banner.hint')"
              @set-image="(img) => saveImage(img, 'yzforum-publish-banner')"></YuzuUpload>
</template>

<style scoped lang="scss">
.upload {
  margin-bottom: 20px;
}
</style>