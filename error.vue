<script lang="ts" setup>

import {useRandomSticker} from "~/composables/useRandomSticker";

const {locale, t} = useI18n()
const error = useError()
const localePath = useLocalePath()

async function handleError() {
  clearError({
    redirect: localePath('/').toString()
  })
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
  location.reload()
}
</script>

<template>
  <NuxtLayout>
    <div v-if="error" class="root">
      <div v-if="error.statusCode === 404" class="card">
        <h1>404</h1>
        <NuxtImg :src="useRandomSticker"></NuxtImg>
        <p>{{ t('pageError.404') }}</p>
      </div>
      <div v-else class="card">
        <h1>{{ error.message }}</h1>
        <p>{{ t('pageError.error') }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100dvh - 75px);
  max-width: 80rem;
  margin: 0 auto;
}

.card {
  margin: 0 auto;
  padding: 17px;

  @include yz-center;
  flex-direction: column;
  @include yz-blur;

  h1 {
    color: var(--yzforum-red-5);

    &:before {
      content: '';
      color: var(--yzforum-blue-5);
      margin-right: 0;
    }
  }

  img {
    margin: 10px 0;
  }

  p {
    text-align: center;
    font-weight: bold;
    margin-bottom: 17px;
  }
}
</style>