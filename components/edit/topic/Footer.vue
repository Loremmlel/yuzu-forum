<script setup lang="ts">
const {t} = useI18n()
</script>

<template>
  <div class="footer">
    <EditTopicTags></EditTopicTags>
    <p class="hint">{{t('edit.topic.categories')}}</p>
    <div class="partition">
      <EditTopicCategory></EditTopicCategory>
      <EditTopicSection></EditTopicSection>
    </div>
    <EditInfoNotice></EditInfoNotice>
    <EditTopicButton></EditTopicButton>
  </div>
</template>

<style scoped lang="scss">
.footer {
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.hint {
  margin-top: 17px;
  margin-bottom: 10px;
}

.partition {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

a {
  margin: 16px 0;
  color: var(--yzforum-blue-5);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>