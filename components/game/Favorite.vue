<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

interface Props {
  gid: number
  toUid: number
  favoritesCount: number
  isFavorite: boolean
}

const props = defineProps<Props>()

const userStore = usePersistUserStore()
const isFavorite = ref(props.isFavorite)
const favoritesCount = ref(props.favoritesCount)

async function toggleFavoriteGame() {
  const result = await $fetch(`/api/game/${props.gid}/favorite`, {
    method: 'PUT',
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    favoritesCount.value += isFavorite.value ? -1 : 1
    if (!isFavorite.value) {
      useMessage(InfoCode.GameFavoriteAdded, 'success')
    } else {
      useMessage(InfoCode.GameFavoriteRemoved, 'success')
    }
    isFavorite.value = !isFavorite.value
  }
}

const handleClickFavoriteThrottled = throttle(toggleFavoriteGame, 1000, () =>
    useMessage(InfoCode.GameActionCooldown, 'warn')
)

function handleClickFavorite() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToFavoriteGame, 'warn', 5000)
    return
  }
  handleClickFavoriteThrottled()
}
</script>

<template>
  <span :class="isFavorite ? 'active' : ''" class="favorite" @click="handleClickFavorite">
    <Icon class="icon" name="lucide:heart"></Icon>
    <span v-if="favoritesCount">{{ favoritesCount }}</span>
  </span>
</template>

<style lang="scss" scoped>
.favorite {
  color: var(--yzforum-font-color-2);
  cursor: pointer;
  @include yz-center;

  .icon {
    font-size: 24px;
    margin-right: 3px;
  }
}

.active .icon {
  color: var(--yzforum-red-4);
}
</style>