<script lang="ts" setup>
const value = defineModel<string | number>({required: true})
</script>

<template>
  <input v-model="value" class="yuzu-input" type="text"></input>
</template>

<style lang="scss" scoped>
.yuzu-input {
  padding: 8px 12px;
  border: 1px solid var(--yzforum-trans-blue-2);
  color: var(--yzforum-font-color-3);
  border-radius: 10px;
  font-size: 15px;
  background-color: transparent;

  &:focus {
    border: 1px solid var(--yzforum-blue-5);
    background-color: var(--yzforum-trans-blue-0);
    box-shadow: 0 0 0 0.5px var(--yzforum-blue-5);
  }
}
</style>