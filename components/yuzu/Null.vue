<script lang="ts" setup>
interface Props {
  condition: boolean,
  type: 'null' | '404',
  showSticker?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSticker: true
})

const {t} = useI18n()
</script>

<template>
  <div v-if="condition" class="yuzu-null">
    <NuxtImg v-if="showSticker" :src="useRandomSticker" loading="lazy" placeholder="/apple-touch-icon.webp"></NuxtImg>
    <span v-if="type === 'null'">{{ t('null.null') }}</span>
    <span v-if="type === '404'">{{ t('pageError.404') }}</span>
  </div>
</template>

<style lang="scss" scoped>
.yuzu-null {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 150px;
    height: 150px;
    margin: 10px 0;
  }

  span {
    color: var(--yzforum-pink-4);
    font-weight: bold;
    text-align: center;
  }
}
</style>