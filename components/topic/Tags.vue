<script lang="ts" setup>
interface Props {
  tags: string[]
  showIcon: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <span v-if="props.tags.length" class="tags">
    <span v-if="props.showIcon" class="label">
      <Icon class="icon" name="lucide:tags"></Icon>
    </span>
    <span v-for="(tag, index) in props.tags" :key="index" class="tags-list">
      {{ tag }}
    </span>
  </span>
</template>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  color: var(--yzforum-font-color-3);
  user-select: text;

  .tags-list {
    margin: 5px;
    font-size: small;
    padding: 5px 20px;
    background-color: var(--yzforum-trans-blue-0);
    border: 1px solid var(--yzforum-blue-5);
    border-radius: 14px;
  }
}

.label {
  font-size: 24px;
  margin: 0 20px;
  color: var(--yzforum-blue-5);
  flex-shrink: 0;
}
</style>