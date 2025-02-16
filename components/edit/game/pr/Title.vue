<script lang="ts" setup>
const {t} = useI18n()

const gamePRStore = useTempGamePRStore()
const title = computed(() => gamePRStore.gamePR[0].name)
</script>

<template>
  <YuzuHeader :show-help="true" :size="2">
    <template #header>{{ t('edit.game.title.name') }}</template>

    <template #help>{{ t('edit.game.title.help') }}</template>
  </YuzuHeader>

  <div class="titles">
    <YuzuInput v-model="title['en-us']" :placeholder="t('edit.game.introduction.en-us')"></YuzuInput>
    <YuzuInput v-model="title['ja-jp']" :placeholder="t('edit.game.introduction.ja-jp')"></YuzuInput>
    <YuzuInput v-model="title['zh-cn']" :placeholder="t('edit.game.introduction.zh-cn')"></YuzuInput>
  </div>
</template>

<style lang="scss" scoped>
.titles {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  input {
    margin-bottom: 10px;
  }
}
</style>