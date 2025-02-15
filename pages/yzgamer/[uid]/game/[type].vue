<script lang="ts" setup>
import type {GameType, UserInfo} from "~/types/api/user";

const props = defineProps<{ user: UserInfo }>()
const route = useRoute()
const gameType = ref(route.params.type as GameType)

const count = computed(() => {
  switch (gameType.value) {
    case 'publish':
      return props.user.game
    case 'like':
      return props.user.likeGame
    case 'favorite':
      return props.user.favoriteGame
    case 'contribute':
      return props.user.contributeGame
    default:
      return 0
  }
})
</script>

<template>
  <YzgamerList>
    <YzgamerGame :uid="user.uid" :type="gameType"></YzgamerGame>

    <YuzuNull :condition="count === 0" type="null"></YuzuNull>
  </YzgamerList>
</template>

<style lang="scss" scoped>

</style>