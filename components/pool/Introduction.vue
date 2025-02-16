<script lang="ts" setup>
defineProps<{ section: string[], tags: string[] }>()
</script>

<template>
  <div class="introduction">
    <TopicSection :section="section"></TopicSection>
    <span v-for="(tag, index) in tags" :key="index" class="tags">
      {{ tag }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.introduction {
  display: flex;
  flex-wrap: wrap;
  font-size: small;

  .tags {
    margin: 3px;
    padding: 3px 20px;
    border: 1px solid var(--yzforum-blue-5);
    border-radius: 15px;
  }
}
</style>