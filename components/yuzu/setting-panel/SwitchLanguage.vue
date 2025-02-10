<script lang="ts" setup>
// availableLocale只有zh-cn，不知道为什么没有en-us和ja-jp
// 手动设置语言有效。见template
const {locale, setLocale, t} = useI18n()
</script>

<template>
  <div class="set-locale">
    <span>{{ t('header.settings.language') }}</span>

    <YuzuSelect :default-value="locale" :options="['zh-cn', 'en-us', 'ja-jp']" :styles="{width:'120px'}"
                class="yuzu-select"
                i18n="header.settings" @set="(value: string) => setLocale(value as Language)">
      <span>{{ t(`header.settings.${locale}`) }}</span>
    </YuzuSelect>
  </div>
</template>

<style lang="scss" scoped>
.set-locale {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.yuzu-select {
  width: 100px;
}
</style>