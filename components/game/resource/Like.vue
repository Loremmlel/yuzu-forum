<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{
  gid: number
  grid: number
  toUid: number
  likes: number[]
}>()

const userStore = usePersistUserStore()
const isLiked = ref(props.likes.includes(userStore.uid))
const likesCount = ref(props.likes.length)

watch(
    () => props.likes,
    (newLikes) => {
      isLiked.value = newLikes.includes(userStore.uid)
      likesCount.value = newLikes.length
    }
)

async function likeResource() {
  if (isLiked.value) {
    useMessage(InfoCode.AlreadyLikedComment, 'warn')
    return
  }

  const result = await $fetch(`/api/game/${props.gid}/resource/like`, {
    method: 'PUT',
    query: {grid: props.grid},
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    likesCount.value++
    isLiked.value = true
    useMessage(InfoCode.GameLikeAdded, 'success')
  }
}

async function handleClickLike() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToLikeGame, 'warn', 5000)
    return
  }
  await likeResource()
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

  .icon {
    margin-right: 3px;
  }
}

.active .icon {
  color: var(--yzforum-red-4);
}
</style>