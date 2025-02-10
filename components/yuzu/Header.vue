<script lang="ts" setup>
interface Props {
  size: number
  showHelp?: boolean
}

const props = defineProps<Props>()

const show = ref(false)
const showHelp = computed(() => props.showHelp ?? false)
</script>

<template>
  <div :class="`size-${size}`" class="yuzu-header">
    <slot name="header"></slot>
    <span v-if="showHelp" @click="show = !show">
      <Icon class="icon" name="lucide:circle-help"></Icon>
    </span>
  </div>

  <slot name="addition"></slot>

  <p v-if="show" class="yuzu-header-help">
    <slot name="help"></slot>
  </p>
</template>

<style lang="scss" scoped>
.yuzu-header {
  margin-bottom: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;

  &::before {
    content: '#';
    color: var(--yzforum-blue-5);
    margin-right: 10px;
  }

  .icon {
    cursor: pointer;
    color: var(--yzforum-blue-5);
    font-size: large;
    margin-left: 10px;
  }
}

.yuzu-header-help {
  margin-bottom: 20px;
  font-size: small;
  color: var(--yzforum-font-color-0);
  font-style: oblique;
}

.size-1 {
  font-size: 32px;
}

.size-2 {
  font-size: 24px;
}

.size-3 {
  font-size: 18px;
}
</style>