<script setup lang="ts">
const {t} = useI18n()
const pageNumber = defineModel<number>({required: true})

const props = defineProps<{status: UseFetchStatus}>()
</script>

<template>
  <YuzuDivider margin="30px" color="var(--yzforum-gray-4)">
    <slot></slot>
    <span v-if="props.status !== 'pending'" @click="pageNumber++" class="loader">
      {{t('home.load')}}
    </span>
    <span v-else>{{t('home.loading')}}</span>
  </YuzuDivider>
</template>

<style scoped lang="scss">
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