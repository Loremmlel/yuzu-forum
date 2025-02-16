<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

interface Props {
  gid: number
  toUid: number
  likesCount: number
  isLiked: boolean
}

const props = defineProps<Props>()

const userStore = usePersistUserStore()
const isLiked = ref(props.isLiked)
const likesCount = ref(props.likesCount)

async function toggleLikeGame() {
  const result = await $fetch(`/api/game/${props.gid}/like`, {
    method: 'PUT',
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    likesCount.value += isLiked.value ? -1 : 1

    if (!isLiked.value) {
      useMessage(InfoCode.GameLikeAdded, 'success')
    } else {
      useMessage(InfoCode.GameLikeRemoved, 'success')
    }
    isLiked.value = !isLiked.value
  }
}

const handleClickLikeThrottled = throttle(toggleLikeGame, 1000, () =>
    useMessage(InfoCode.GameActionCooldown, 'warn')
)

function handleClickLike() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToLikeGame, 'warn', 5000)
    return
  }
  if (userStore.uid === props.toUid) {
    useMessage(InfoCode.SelfGameLikeDisallowed, 'warn')
    return
  }
  handleClickLikeThrottled()
}
</script>

<template>
  <span :class="isLiked ? 'active' : ''" class="like" @click="handleClickLike">
    <Icon class="icon" name="lucide:thumbs-up"></Icon>
    <span v-if="likesCount">{{ likesCount }}</span>
  </span>
</template>

<style lang="scss" scoped>
.like {
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