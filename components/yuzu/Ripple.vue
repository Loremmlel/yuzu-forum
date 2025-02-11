<script setup lang="ts">
const props = defineProps<{
  ripples: RippleType[]
}>()
</script>

<template>
  <span v-for="ripple in ripples" :key="ripple.key" class="ripple"
      :style="{
        width: `${ripple.size}px`,
        height: `${ripple.size}px`,
        top: `${ripple.y}px`,
        left: `${ripple.x}px`
      }"></span>
</template>

<style scoped lang="scss">
.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transform: scale(0);
  animation: ripple-animation 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(2);
    opacity: 0;
  }
}
</style>