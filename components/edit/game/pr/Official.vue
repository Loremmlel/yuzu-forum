<script lang="ts" setup>
const {t} = useI18n()

const gamePRStore = useTempGamePRStore()
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{ t('edit.pr.official.name') }}
    </template>
  </YuzuHeader>

  <div class="hint">
    {{ t('edit.pr.official.hint') }}
  </div>

  <YuzuTextarea v-model="gamePRStore.gamePR[0].official"
                :placeholder="`${t('edit.pr.official.placeholder')}`"></YuzuTextarea>
</template>

<style lang="scss" scoped>
.yuzu-textarea {
  width: 100%;
  margin-bottom: 20px;
}

.hint {
  color: var(--yzforum-font-color-0);
  margin-bottom: 20px;
  font-size: small;
}
</style>