<script lang="ts" setup>
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
  <YuzuHeader :show-help="true" :size="2">
    <template #header>{{ t('edit.game.banner.name') }}</template>
    <template #help>{{ t('edit.game.banner.help') }}</template>
  </YuzuHeader>
  <YuzuUpload :aspect="16 / 9" :hint="t('edit.game.banner.hint')" :initial-image="initialImageUrl" :size="1920"
              class="upload" width="300px"
              @set-image="(img) => saveImage(img, 'yzforum-publish-banner')"></YuzuUpload>
</template>

<style lang="scss" scoped>
.upload {
  margin-bottom: 20px;
}
</style>