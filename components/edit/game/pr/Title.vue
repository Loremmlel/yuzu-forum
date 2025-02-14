<script setup lang="ts">
const {t} = useI18n()

const gamePRStore = useTempGamePRStore()
const title = computed(() => gamePRStore.gamePR[0].name)
</script>

<template>
  <YuzuHeader :size="2" :show-help="true">
    <template #header>{{ t('edit.game.title.name') }}</template>

    <template #help>{{ t('edit.game.title.help') }}</template>
  </YuzuHeader>

  <div class="titles">
    <YuzuInput :placeholder="t('edit.game.introduction.en-us')" v-model="title['en-us']"></YuzuInput>
    <YuzuInput :placeholder="t('edit.game.introduction.ja-jp')" v-model="title['ja-jp']"></YuzuInput>
    <YuzuInput :placeholder="t('edit.game.introduction.zh-cn')" v-model="title['zh-cn']"></YuzuInput>
  </div>
</template>

<style scoped lang="scss">
.titles {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  input {
    margin-bottom: 10px;
  }
}
</style>