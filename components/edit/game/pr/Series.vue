<script lang="ts" setup>
const {t} = useI18n()

const gamePRStore = useTempGamePRStore()
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{ t('edit.pr.series.name') }}
    </template>
  </YuzuHeader>

  <div class="hint">
    {{ t('edit.pr.series.hint') }}
  </div>

  <YuzuTextarea v-model="gamePRStore.gamePR[0].series"
                :placeholder="`${t('edit.pr.series.placeholder')}`"></YuzuTextarea>
</template>

<style lang="scss" scoped>
.yuzu-input {
  width: 100%;
  margin-bottom: 20px;
}

.hint {
  color: var(--yzforum-font-color-0);
  margin-bottom: 20px;
  font-size: small;
}
</style>