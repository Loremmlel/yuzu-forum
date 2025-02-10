<script lang="ts" setup>
const {t} = useI18n()
const setting = usePersistSettingsStore()

watch(
    () => setting.showYzforumBackgroundBlur,
    debounce(() => {
      setting.setYzforumBackgroundBlur(setting.showYzforumBackgroundBlur)
    }, 300)
)
</script>

<template>
  <div v-tooltip="{
      message: {
        'en-us':
          'This setting may cause the website sluggish on low-performance devices',
        'ja-jp':
          'この設定は、低性能のデバイスでウェブサイトが遅くなる可能性があります。',
        'zh-cn': '该设置项可能会使网站在低性能设备卡顿'
      },
      position: 'bottom'
    }">
    <div class="container">
      <span>{{ t('header.settings.blur') }}</span>
      <span>{{ setting.showYzforumBackgroundBlur }}px</span>
    </div>
    <div class="scroll">
      <span>0px</span>
      <YuzuSlider v-model="setting.showYzforumBackgroundBlur" :max="20" :min="0" :step="1" class="main"></YuzuSlider>
      <span>20px</span>
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
  margin: 20px 10px;
}

.container {
  display: flex;
  justify-content: space-between;
}
</style>