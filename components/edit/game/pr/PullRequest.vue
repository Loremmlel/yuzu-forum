<script lang="ts" setup>
const {locale} = useI18n()
const introductionLanguage = ref(locale.value as Language)
</script>

<template>
  <div class="container">
    <EditGamePrHelp></EditGamePrHelp>
    <EditGamePrTitle></EditGamePrTitle>
    <EditGameIntroduction :introduction-language="introductionLanguage" type="rewrite"
                          @set="(value) => introductionLanguage = value as Language"></EditGameIntroduction>
    <EditGamePrSeries></EditGamePrSeries>
    <EditGamePrOfficial></EditGamePrOfficial>
    <EditGamePrTags></EditGamePrTags>
    <EditGamePrAlias></EditGamePrAlias>
    <EditGamePrFooter></EditGamePrFooter>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 20px;

  @include yz-blur;
}
</style>