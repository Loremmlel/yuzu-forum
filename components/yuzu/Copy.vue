<script setup lang="ts">
import {decodeIfEncoded} from "~/server/utils/decodeIfEncoded";

withDefaults(defineProps<{ text: string; name?: string }>(), {
  name: ''
})
</script>

<template>
  <span class="yuzu-copy" @click="useYuzuCopy(text)">
    <span>{{ decodeIfEncoded(name ? name : text) }}</span>
    <Icon class="icon" name="lucide:copy"></Icon>
  </span>
</template>

<style scoped lang="scss">
.yuzu-copy {
  cursor: pointer;
  color: var(--yzforum-blue-5);
  padding: 3px 10px;
  font-weight: bold;
  border-radius: 10px;
  word-break: break-all;

  &:hover {
    background-color: var(--yzforum-trans-blue-0);
  }

  .icon {
    margin-left: 10px;
  }
}
</style>