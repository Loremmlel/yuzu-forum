<script setup lang="ts">
defineProps<{section: string[], tags: string[]}>()
</script>

<template>
  <div class="introduction">
    <TopicSection :section="section"></TopicSection>
    <span class="tags" v-for="(tag, index) in tags" :key="index">
      {{tag}}
    </span>
  </div>
</template>

<style scoped lang="scss">
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