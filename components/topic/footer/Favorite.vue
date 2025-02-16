<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{
  tid: number
  toUid: number
  favoritesCount: number
  isFavorite: boolean
}>()

const userStore = usePersistUserStore()
const isFavorite = ref(props.isFavorite)
const favoritesCount = ref(props.favoritesCount)

async function toggleFavoriteGame() {
  const result = await $fetch(`/api/topic/${props.tid}/favorite`, {
    method: 'PUT',
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    favoritesCount.value += isFavorite.value ? -1 : 1

    if (!isFavorite.value) {
      useMessage(InfoCode.FavoriteAdded, 'success')
    } else {
      useMessage(InfoCode.FavoriteRemoved, 'success')
    }

    isFavorite.value = !isFavorite.value
  }
}

const handleClickFavoriteThrottled = throttle(toggleFavoriteGame, 1007, () =>
    useMessage(InfoCode.OperationCooldown, 'warn')
)

const handleClickFavorite = () => {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToFavorite, 'warn', 5000)
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
  @include yz-center;
  margin-right: 0;
  color: var(--yzforum-font-color-2);

  .icon {
    cursor: pointer;
    font-size: 24px;
    margin-right: 3px;
  }
}

.active .icon {
  color: var(--yzforum-red-4);
}

@media (max-width: 700px) {
  .favorite {
    .icon {
      font-size: initial;
    }
  }
}
</style>