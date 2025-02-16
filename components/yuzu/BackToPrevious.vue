<script lang="ts" setup>
const router = useRouter()
</script>

<template>
  <div class="return" @click="router.back()">
    <span>< 返回</span>
  </div>
</template>

<style lang="scss" scoped>
.return {
  color: var(--yzforum-font-color-0);
  cursor: pointer;
  @include yz-center;
}

.return:hover {
  color: var(--yzforum-blue-5);
}
</style>