<script setup lang="ts">
interface Props {
  condition: boolean,
  type: 'null' | '404',
  showSticker?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSticker: true
})
</script>

<template>

</template>

<style scoped lang="scss">

</style>