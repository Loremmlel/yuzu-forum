<script lang="ts" setup>
definePageMeta({
  middleware: ['auth', 'prevent']
})

const type = useRequestURL().searchParams.get('type')
</script>

<template>
  <div class="root">
    <EditGame v-if="type === 'publish'"></EditGame>
    <EditGamePrPullRequest v-if="type === 'pr'"></EditGamePrPullRequest>
  </div>
</template>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100dvh - 75px);
  max-width: 80rem;
  margin: 0 auto;
  color: var(--yzforum-font-color-3);
}
</style>