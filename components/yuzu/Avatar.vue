<script setup lang="ts">
interface Props {
  user: YuzuUser
  size: string
}

const props = defineProps<Props>()

const localePath = useLocalePath()

function handleClickAvatar(event: MouseEvent) {
  event.preventDefault()
  navigateTo(localePath(`/yzgamer/${props.user.uid}/info`))
}
</script>

<template>
  <div class="yuzu-avatar" @click="handleClickAvatar($event)">
    <NuxtImg :height="props.size" :width="props.size" v-if="props.user.avatar"
             :src="props.user.avatar.replace(/\.webp/, '-100.webp')" :alt="props.user.name"></NuxtImg>
    <span v-if="!props.user.avatar">{{ props.user.name.slice(0, 1).toUpperCase() }}</span>
  </div>
</template>

<style scoped lang="scss">
.kun-avatar {
  display: flex;
  justify-content: center;

  img {
    border-radius: 50%;
    display: inline-block;
  }

  span {
    height: v-bind(size);
    width: v-bind(size);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--yzforum-blue-5);
    font-weight: bold;
  }
}
</style>