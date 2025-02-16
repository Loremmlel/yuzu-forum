<script lang="ts" setup>
definePageMeta({
  layout: 'message',
  middleware: 'auth'
})

const route = useRoute()
const uid = ref(route.params.uid as string)
</script>

<template>
  <ClientOnly>
    <MessagePmHead :uid="parseInt(uid)"></MessagePmHead>
  </ClientOnly>
  <MessagePmContainer :uid="parseInt(uid)"></MessagePmContainer>
</template>

<style lang="scss" scoped>

</style>