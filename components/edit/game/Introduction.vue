<script setup lang="ts">
import {languageItems} from "~/components/edit/utils/options";

defineProps<{
  introductionLanguage: Language
  type: 'publish' | 'rewrite'
  isSuccess?: boolean
}>()

const emits = defineEmits<{
  set: [value: Language]
}>()

const {t} = useI18n()
</script>

<template>
  <YuzuHeader :size="2" :show-help="true">
    <template #header>{{ t('edit.game.introduction.name') }}</template>
    <template #help>{{ t('edit.game.introduction.help') }}</template>
  </YuzuHeader>

  <YuzuNav class="nav" :items="languageItems" :default-value="introductionLanguage"
           @set="(value) => emits('set', value as Language)"></YuzuNav>
  <EditGameEditor :lang="introductionLanguage" :type="type" :pending="isSuccess"></EditGameEditor>
</template>

<style scoped lang="scss">
.nav {
  margin-bottom: 20px;
}
</style>