<script setup lang="ts">
interface Props {
  margin?: string,
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  margin: '32px 0',
  color: 'var(--yzforum-trans-blue-2)'
})
</script>

<template>
  <div class="yuzu-divider">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.yuzu-divider {
  color:var(--yzforum-font-color-0);
  font-size: small;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-align: center;
  margin-top: v-bind(margin);

  &::before {
    color: v-bind(color);
    content: '';
    position: relative;
    width: 50%;
    border-block-start: 1px solid transparent;
    border-block-start-color: inherit;
    border-block-end: 0;
    transform: translateY(50%);
  }

  &::after {
    color: v-bind(color);
    content: '';
    position: relative;
    width: 50%;
    border-block-start: 1px solid transparent;
    border-block-start-color: inherit;
    border-block-end: 0;
    transform: translateY(50%);
  }
}
</style>