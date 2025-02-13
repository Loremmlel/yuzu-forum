<script setup lang="ts">
defineProps<{
  titles: { title: string }[]
}>()

const {t} = useI18n()
</script>

<template>
  <YuzuHeader :size="2" :show-help="true">
    <template #header>{{ t('edit.game.title.name') }}</template>
    <template #help>{{ t('edit.game.title.help') }}</template>
  </YuzuHeader>

  <div class="reference" v-if="titles.length">
    <b>{{ t('edit.game.title.reference') }}</b>
    <span v-for="(title, index) in titles" :key="index" @click="useYuzuCopy(title.title)">
      {{ title.title }}
    </span>
  </div>

  <div class="titles">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.reference {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;

  b {
    margin-right: 10px;
  }

  span {
    cursor: pointer;
    padding: 0 10px;
    border: 1px solid var(--yzforum-blue-5);
    background-color: var(--yzforum-trans-blue-0);
    border-radius: 20px;
    margin-right: 10px;

    &:hover {
      background-color: var(--yzforum-blue-5);
      color: var(--yzforum-white);
    }
  }
}

.titles {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  input {
    margin-bottom: 10px;
  }
}
</style>