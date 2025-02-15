<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="article">
    <YzgamerEmail></YzgamerEmail>
  </div>
</template>

<style lang="scss" scoped>
.article {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
}

.forget {
  font-size: medium;
  cursor: pointer;
  color: var(--yzforum-blue-5);
}
</style>