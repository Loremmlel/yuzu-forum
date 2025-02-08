<script setup lang="ts">
import {usePersistSettingsStore} from "~/store/modules/settings";

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
  <div class="app" :style="{backgroundImage: `url(${imageURL})`}">
    <div class="top-bar">

    </div>
    <slot></slot>
    <NuxtImg
        v-if="persistSettings.showYzforumBackLoli"
        class="kohaku" src="/image/kohaku.webp" loading="lazy" alt="kohaku">
    </NuxtImg>
  </div>
</template>

<style lang="scss" scoped>
.app {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  background-color: var(--yzforum-white);
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