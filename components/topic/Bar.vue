<script setup lang="ts">
const tempReplyStore = useTempReplyStore()

watch(
    () => tempReplyStore.isScrollToTop,
    () => {
      window?.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      tempReplyStore.isScrollToTop = false
    }
)
</script>

<template>
  <div class="bar">
    <div class="top" @click="tempReplyStore.isScrollToTop = true">
      <Icon class="icon" name="lucide:arrow-up-to-line"></Icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bar {
  position: fixed;
  bottom: 50px;
  right: 20px;
  z-index: 7;
  display: flex;
  flex-direction: column;
}

.top {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  box-shadow: var(--shadow);
  cursor: pointer;
  background-color: var(--yzforum-trans-white-2);
  border-radius: 50%;

  .icon {
    font-size: 22px;
    color: var(--yzforum-blue-5);
  }
}

.top {
  margin-top: 10px;
}
</style>