<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{
  tid?: number
  rid?: number
  toUid: number
  likesCount: number
  isLiked: boolean
}>()

const userStore = usePersistUserStore()
const isLiked = ref(props.isLiked)
const likesCount = ref(props.likesCount)

async function toggleLike() {
  let res = ''
  if (props.tid) {
    const result = await $fetch(`/api/topic/${props.tid}/like`, {
      method: 'PUT',
      watch: false,
      ...yzforumResponseHandler
    })
    res = result ?? ''
  } else {
    const result = await $fetch(`/api/topic/${props.tid}/reply/like`, {
      method: 'PUT',
      query: {rid: props.rid},
      watch: false,
      ...yzforumResponseHandler
    })
    res = result ?? ''
  }

  if (res) {
    likesCount.value += isLiked.value ? -1 : 1

    if (!isLiked.value) {
      useMessage(InfoCode.LikeAdded, 'success')
    } else {
      useMessage(InfoCode.LikeRemoved, 'success')
    }

    isLiked.value = !isLiked.value
  }
}

const handleClickLikeThrottled = throttle(toggleLike, 1007, () =>
    useMessage(InfoCode.OperationCooldown, 'warn')
)

function handleClickLike() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToVote, 'warn', 5000)
    return
  }
  if (userStore.uid === props.toUid) {
    useMessage(InfoCode.SelfVoteDisallowed, 'warn')
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
  .like {
    .icon {
      font-size: initial;
    }
  }
}
</style>