<script lang="ts" setup>
import DOMPurify from "isomorphic-dompurify"

defineProps<{
  content: string
}>()
</script>

<template>
  <div class="yzforum-content" v-html="DOMPurify.sanitize(content, {ADD_ATTR: ['line']})"></div>
</template>

<style lang="scss" scoped>
// @use不生效，@import能行吗？
@import '~/assets/css/editor/index.scss';
@import '~/assets/css/editor/yuzu-content.scss';

.yzforum-content {
  width: calc(100% - 135px);
  padding-top: 10px;
  padding-right: 20px;

  code[class*='language-'],
  pre[class*='language-'] {
    color: var(--yzforum-font-color-3);
  }
}

@media (max-width: 700px) {
  .yzforum-content {
    padding: 10px;
    width: 100%;
    text-wrap: wrap;
    white-space: wrap;
    overflow-x: auto;
  }
}
</style>