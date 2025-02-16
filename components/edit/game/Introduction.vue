<script lang="ts" setup>
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
  <YuzuHeader :show-help="true" :size="2">
    <template #header>{{ t('edit.game.introduction.name') }}</template>
    <template #help>{{ t('edit.game.introduction.help') }}</template>
  </YuzuHeader>

  <YuzuNav :default-value="introductionLanguage" :items="languageItems" class="nav"
           @set="(value) => emits('set', value as Language)"></YuzuNav>
  <EditGameEditor :lang="introductionLanguage" :pending="isSuccess" :type="type"></EditGameEditor>
</template>

<style lang="scss" scoped>
.nav {
  margin-bottom: 20px;
}
</style>