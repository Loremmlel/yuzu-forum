<script setup lang="ts">
const props = defineProps<{showDialog: boolean}>()
</script>

<template>
  <Teleport to="body" :disabled="!showDialog">
    <Transition name="dialog">
      <div v-if="showDialog" class="mask" tabindex="0">
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--yzforum-mask-color-0);
  display: flex;
  transition: opacity 0.3s ease;
  color: var(--yzforum-font-color-3);
}

.dialog-enter-from, .dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from, .dialog-leave-to {
  &:deep(.container) {
    transform: scale(1.1);
  }
}
</style>