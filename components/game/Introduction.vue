<script setup lang="ts">
import {languageItems} from "~/components/edit/utils/options";

const {locale, t} = useI18n()
const introductionLanguage = ref(locale.value)

defineProps<{
  introduction: YuzuLanguage
}>()
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{ t('game.introduction.name') }}
    </template>
  </YuzuHeader>

  <YuzuNav class="nav" :items="languageItems" :default-value="introductionLanguage"
           @set="(value) => introductionLanguage = value as Language"></YuzuNav>

  <div class="hint" v-if="introduction[introductionLanguage as Language] === ''">
    {{ t('game.introduction.hint') }}
  </div>

  <YuzuContent class="yuzu-content"
               :content="getPreferredLanguageText(introduction, introductionLanguage as Language)"></YuzuContent>
</template>

<style scoped lang="scss">
h2 {
  margin: 20px 0;
}

.hint {
  margin-top: 20px;
  color: var(--yzforum-white);
  background-color: var(--yzforum-blue-5);
  font-size: 15px;
  padding: 5px 10px;
}

.yuzu-content {
  width: 100%;
}
</style>