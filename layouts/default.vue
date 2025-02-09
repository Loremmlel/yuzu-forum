<script lang="ts" setup>
import {usePersistSettingsStore} from "~/store/modules/setting";

const persistSettings = usePersistSettingsStore()

const imageURL = ref('')

onMounted(async () => {
  imageURL.value = await persistSettings.getCurrentBackground()
})

watch(
    () => persistSettings.showYzforumBackground,
    async () => {
      imageURL.value = await persistSettings.getCurrentBackground()
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
        v-if="persistSettings.showYzforumBackLoli"
        alt="kohaku" class="kohaku" loading="lazy" src="/image/kohaku.webp">
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

.kohaku {
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