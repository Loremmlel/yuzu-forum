<script lang="ts" setup>
import {usePersistSettingsStore} from "~/store/modules/setting";

const setting = usePersistSettingsStore()

const imageURL = ref('')

onMounted(async () => {
  imageURL.value = await setting.getCurrentBackground()
})

watch(
    () => setting.showYzforumBackground,
    async () => {
      imageURL.value = await setting.getCurrentBackground()
    }
)
</script>

<template>
  <div :style="{backgroundImage: `url(${imageURL})`}" class="app">
    <div class="top-bar">
      <YuzuTopBar></YuzuTopBar>
    </div>
    <slot></slot>
    <NuxtImg
        v-if="setting.showYzforumBackLoli"
        alt="loli" class="loli" loading="lazy" src="/image/loli.webp">
    </NuxtImg>
  </div>
</template>

<style lang="scss" scoped>
.app {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  background-color: var(--yzforum-blue-0);
  min-height: 100dvh;
}

.loli {
  position: fixed;
  user-select: none;
  pointer-events: none;
  bottom: 0;
  right: 0;
  opacity: 0.17;
  z-index: 0;
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 1007;
}
</style>