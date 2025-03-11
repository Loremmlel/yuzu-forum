<script lang="ts" setup>

</script>

<template>
  <div class="list">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.list {
  width: 100%;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;

  // fix: 修复移动端下某些文本可能溢出的问题
  * {
    word-break: break-all;
    white-space: pre-wrap;
  }
}

@media (max-width: 700px) {
  .list {
    padding-left: 5px;
  }
}
</style>