<script lang="ts" setup>
const {t} = useI18n()
const tempEdit = useTempEditStore()
</script>

<template>
  <div class="settings">
    <div class="save">
      {{ `${t('edit.topic.save')} × ${tempEdit.autosaveCount} ` }}
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>