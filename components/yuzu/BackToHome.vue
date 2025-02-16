<script lang="ts" setup>

</script>

<template>
  <NuxtLink class="return" to="/">
    <Icon class="icon" name="lucide:home"></Icon>
    <span>主页</span>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.return {
  color: var(--yzforum-font-color-0);
  cursor: pointer;
  @include yz-center;

  .icon {
    font-size: 18px;
    margin-right: 5px;
  }
}

.return:hover {
  color: var(--yzforum-blue-5);
}
</style>