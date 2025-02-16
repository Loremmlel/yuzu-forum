<script lang="ts" setup>
</script>

<template>
  <div class="yuzu-footer">
    <div>{{ `© 2025 柚子游戏` }}</div>
    <div>
      <span>GitHub 开源 -></span>

      <a
          aria-label="Yuzu Game Forum Open Source GitHub Repository. 柚子游戏论坛 开源 GitHub 仓库" href="https://github.com/Loremmlel/yuzu-forum" rel="noopener noreferer"
          target="_blank">
        <Icon class="icon" name="lucide:github"></Icon>
      </a>
    </div>

    <div>
      <span>{{ `保留所有权利 | 版本 ${useRuntimeConfig().public.FORUM_VERSION}` }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.yuzu-footer {
  letter-spacing: 1px;
  color: var(--yzforum-font-color-3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;

  div {
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 5px;
      color: var(--yzforum-blue-5);
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.5);
      }
    }
  }
}
</style>