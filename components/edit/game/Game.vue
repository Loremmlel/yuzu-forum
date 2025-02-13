<script setup lang="ts">
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
      <YuzuInput :placeholder="t('edit.game.introduction.en-us')" v-model="editGameStore.name['en-us']"></YuzuInput>
      <YuzuInput :placeholder="t('edit.game.introduction.ja-jp')" v-model="editGameStore.name['ja-jp']"></YuzuInput>
      <YuzuInput :placeholder="t('edit.game.introduction.zh-cn')" v-model="editGameStore.name['zh-cn']"></YuzuInput>
    </EditGameTitle>

    <EditGameIntroduction :introduction-language="introductionLanguage" type="publish"
                          :is-success="isSuccess"
                          @set="(value) => introductionLanguage = value as Language"></EditGameIntroduction>

    <EditGameBanner></EditGameBanner>

    <EditGameFooter></EditGameFooter>
  </div>
</template>

<style scoped lang="scss">
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