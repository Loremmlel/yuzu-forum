<script lang="ts" setup>
import DOMPurify from "isomorphic-dompurify"

defineProps<{
  content: string
}>()
</script>

<template>
  <div class="yzforum-content" v-html="DOMPurify.sanitize(content, {ADD_ATTR: ['line']})"></div>
</template>

<style lang="scss">
// 解决样式在子元素不生效的问题
// 都是scope惹的错~ 害我debug一小时多~
@use '~/assets/css/editor/index.scss';
@use '~/assets/css/editor/yuzu-content.scss';
</style>

<style lang="scss" scoped>
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
    // 超出容器宽度的文本换行
    * {
      word-break: break-all;
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }
  }
}
</style>