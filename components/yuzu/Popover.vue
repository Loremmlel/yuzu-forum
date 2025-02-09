<script setup lang="ts">
const show = ref(false)
</script>

<template>
  <div class="yz-popover" @mouseover="show = true" @mouseleave="show = false">
    <slot></slot>
    <Transition name="slide-fade">
      <div class="popover" v-if="show">
        <slot name="content"></slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.yz-popover {
  width: 100%;
  position: relative;
  display: inline-block;
}

.popover {
  background-color: transparent;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s ease-in;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>