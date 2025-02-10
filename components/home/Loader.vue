<script lang="ts" setup>
const {t} = useI18n()
const pageNumber = defineModel<number>({required: true})

const props = defineProps<{ status: UseFetchStatus }>()
</script>

<template>
  <YuzuDivider color="var(--yzforum-gray-4)" margin="30px">
    <slot></slot>
    <span v-if="props.status !== 'pending'" class="loader" @click="pageNumber++">
      {{ t('home.load') }}
    </span>
    <span v-else>{{ t('home.loading') }}</span>
  </YuzuDivider>
</template>

<style lang="scss" scoped>
span {
  &:first-child {
    padding-left: 20px;
  }

  &:last-child {
    padding-right: 20px;
  }
}

.loader {
  cursor: pointer;

  &:hover {
    color: var(--yzforum-blue-5);
  }
}
</style>