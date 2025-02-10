<script setup lang="ts">
const {t} = useI18n()
const {fold} = storeToRefs(usePersistYzforumHomeStore())
</script>

<template>
  <HomePinned></HomePinned>
  <YuzuDivider margin="10px"></YuzuDivider>

  <YuzuHeader :size="2">
    <template #header>
      <div class="header">
        <span>{{ t('home.updates') }}</span>
        <span class="suffix" @click="fold.updates = !fold.updates">
        {{ t(`home.${fold.updates ? 'foldSection' : 'expandSection'}`) }}
        </span>
      </div>
    </template>
  </YuzuHeader>
  <HomeRecent></HomeRecent>

  <YuzuHeader :size="2">
    <template #header>
      <div class="header">
        <span>{{t('home.topics')}}</span>
        <span class="suffix" @click="fold.topics = !fold.topics">
        {{ t(`home.${fold.topics ? 'foldSection' : 'expandSection'}`) }}
        </span>
      </div>
    </template>
  </YuzuHeader>
  <HomeTopicContainer></HomeTopicContainer>

  <YuzuHeader :size="2">
    <template #header>
      <div class="header">
        <span>{{t('home.games')}}</span>
        <span class="suffix" @click="fold.games = !fold.games">
        {{ t(`home.${fold.games ? 'foldSection' : 'expandSection'}`) }}
        </span>
      </div>
    </template>
  </YuzuHeader>
  <HomeGameContainer></HomeGameContainer>

  <YuzuHeader :size="2">
    <template #header>
      <div class="header">
        <span>{{t('home.resources')}}</span>
        <span class="suffix" @click="fold.resources = !fold.resources">
        {{ t(`home.${fold.resources ? 'foldSection' : 'expandSection'}`) }}
        </span>
      </div>
    </template>
  </YuzuHeader>
  <HomeResourceContainer></HomeResourceContainer>

  <HomeFooter></HomeFooter>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .suffix {
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: var(--yzforum-font-color-1);

    &:hover {
      color: var(--yzforum-blue-5);
    }
  }
}
</style>