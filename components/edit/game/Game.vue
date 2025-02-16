<script lang="ts" setup>
import {usePersistEditGameStore} from "~/store/modules/edit/game";

const {locale, t} = useI18n()
const introductionLanguage = ref(locale.value as Language)
const isSuccess = ref(false)
const isFetching = ref(false)

const data = ref<{
  title: string,
  titles: { title: string }[],
  description: string,
  aliases: string[]
}>({
  title: '',
  titles: [],
  description: '',
  aliases: []
})

const editGameStore = usePersistEditGameStore()
</script>

<template>
  <div class="container">
    <EditGameTitle :titles="data.titles">
      <YuzuInput v-model="editGameStore.name['en-us']" :placeholder="t('edit.game.introduction.en-us')"></YuzuInput>
      <YuzuInput v-model="editGameStore.name['ja-jp']" :placeholder="t('edit.game.introduction.ja-jp')"></YuzuInput>
      <YuzuInput v-model="editGameStore.name['zh-cn']" :placeholder="t('edit.game.introduction.zh-cn')"></YuzuInput>
    </EditGameTitle>

    <EditGameIntroduction :introduction-language="introductionLanguage" :is-success="isSuccess"
                          type="publish"
                          @set="(value) => introductionLanguage = value as Language"></EditGameIntroduction>

    <EditGameBanner></EditGameBanner>

    <EditGameFooter></EditGameFooter>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 20px;

  @include yz-blur;
}

:deep(h2) {
  margin-bottom: 20px;

  .icon {
    font-size: large;
    margin-left: 10px;
  }
}

.divider {
  padding: 0 20px;
}

.vndb {
  display: flex;
  margin-bottom: 20px;

  input {
    margin-right: 20px;
  }
}

.info {
  color: var(--yzforum-font-color-0);
  font-size: small;
  font-style: oblique;
  margin-bottom: 20px;
}

.titles {
  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 10px;
  }
}
</style>