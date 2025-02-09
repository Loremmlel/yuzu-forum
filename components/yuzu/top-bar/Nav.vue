<script setup lang="ts">
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const getRouteBaseName = useRouteBaseName()
const baseRouteName = computed(() => {
  return getRouteBaseName(route)
})

const { showYzforumHamburger, messageStatus } = storeToRefs(useTempSettingStore())
watch(
    () => baseRouteName.value,
    () => {
      useTempSettingStore().reset()
    }
)

onMounted(async () => {
  const result = await $fetch('/api/message/unread', {
    method: 'GET'
  })
  if () {

  }
})

</script>

<template>

</template>

<style scoped lang="scss">

</style>