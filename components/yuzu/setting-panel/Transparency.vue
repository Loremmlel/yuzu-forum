<script lang="ts" setup>
const {t} = useI18n()
const colorMode = useColorMode()
const setting = usePersistSettingsStore()

watch(
    () => setting.showYzforumPageTransparency,
    debounce(() => {
      setting.setYzforumTransparency(
          setting.showYzforumPageTransparency,
          colorMode.value as 'dark' | 'light'
      )
    }, 300)
)
</script>

<template>
  <div>
    <div class="container">
      <span>{{ t('header.settings.trans') }}</span>
      <span>{{ setting.showYzforumPageTransparency }}%</span>
    </div>

    <div class="scroll">
      <span>10%</span>
      <YuzuSlider v-model="setting.showYzforumPageTransparency" :max="90" :min="10" :step="1" class="main"></YuzuSlider>
      <span>90%</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll {
  width: 100%;
  font-size: 15px;
  display: flex;
  align-items: center;
}

.main {
  width: 100%;
  margin: 15px 10px;
}

.container {
  display: flex;
  justify-content: space-between;
}
</style>