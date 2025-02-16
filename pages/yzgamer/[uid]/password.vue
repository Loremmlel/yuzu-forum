<script lang="ts" setup>
const {t} = useI18n()

definePageMeta({
  middleware: 'auth'
})

const localePath = useLocalePath()
</script>

<template>
  <div class="article">
    <YzgamerPassword></YzgamerPassword>

    <span class="forgot" @click="navigateTo(localePath('/forgot'))">
      {{ t('login.forgot') }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.article {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
}

.forgot {
  font-size: medium;
  cursor: pointer;
  color: var(--yzforum-blue-5);
}
</style>