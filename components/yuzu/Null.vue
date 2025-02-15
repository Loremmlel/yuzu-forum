<script setup lang="ts">
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
  <div class="yuzu-null" v-if="condition">
    <NuxtImg v-if="showSticker" :src="useRandomSticker" loading="lazy" placeholder="/apple-touch-icon.png"></NuxtImg>
    <span v-if="type === 'null'">{{ t('null.null') }}</span>
    <span v-if="type === '404'">{{ t('pageError.404') }}</span>
  </div>
</template>

<style scoped lang="scss">
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