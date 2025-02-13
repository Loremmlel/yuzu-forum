<script setup lang="ts">
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{
  tid?: number
  rid?: number
  toUid: number
  dislikesCount: number
  isDisliked: boolean
}>()

const userStore = usePersistUserStore()
const isDisliked = ref(props.isDisliked)
const dislikesCount = ref(props.dislikesCount)

async function toggleDislike() {
  let res = ''
  if (props.tid) {
    const result = await $fetch(`/api/topic/${props.tid}/dislike`, {
      method: 'PUT',
      watch: false,
      ...yzforumResponseHandler
    })
    res = result ?? ''
  } else {
    const result = await $fetch(`/api/topic/${props.tid}/reply/dislike`, {
      method: 'PUT',
      query: {rid: props.rid},
      watch: false,
      ...yzforumResponseHandler
    })
    res = result ?? ''
  }

  if (res) {
    dislikesCount.value += isDisliked.value ? -1 : 1

    if (!isDisliked.value) {
      useMessage(InfoCode.DislikeSuccess, 'success')
    } else {
      useMessage(InfoCode.CancelDislikeSuccess, 'success')
    }

    isDisliked.value = !isDisliked.value
  }
}

const handleClickDislikeThrottled = throttle(toggleDislike, 1007, () =>
    useMessage(InfoCode.OperationCooldown, 'warn')
)

function handleClickDislike() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToDislike, 'warn', 5000)
    return
  }
  if (userStore.uid === props.toUid) {
    useMessage(InfoCode.SelfDislikeDisallowed, 'warn')
    return
  }
  handleClickDislikeThrottled()
}
</script>

<template>
  <span class="dislike" :class="isDisliked ? 'active' : ''" @click="handleClickDislike">
    <Icon class="icon" name="lucide:thumbs-down"></Icon>
    <span v-if="dislikesCount">{{ dislikesCount }}</span>
  </span>
</template>

<style scoped lang="scss">
.dislike {
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
  .dislike {
    .icon {
      font-size: initial;
    }
  }
}
</style>