<script setup lang="ts">
interface Props {
  user: YuzuUser,
  time: number
}
const props = defineProps<Props>()

const {locale, t} = useI18n()
const localePath = useLocalePath()

function handleClickAvatar(event: MouseEvent){
  event.preventDefault()
  navigateTo(localePath(`/yzgamer/${props.user.uid}/info`))
}
</script>

<template>
  <div class="user">
    <div class="avatar" @click="handleClickAvatar($event)">
      <NuxtImg height="50" width="50" v-if="user.avatar"
          :src="user.avatar.replace(/\.webp$/, '-100.webp')" :alt="user.name"></NuxtImg>
      <span v-if="!user.avatar">
        {{ user.name.slice(0, 1).toUpperCase() }}
      </span>
    </div>

    <div class="info">
      <span>{{ user.name }}</span>
      <span class="time">
        {{ formatDate(props.time, locale, { isPrecise: true }) }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user {
  display: flex;
  margin: 10px 0;
}

.avatar {
  display: flex;
  justify-content: center;
  margin-right: 10px;

  img {
    border-radius: 50%;
    display: inline-block;
  }

  span {
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--yzforum-blue-5);
    font-weight: bold;
  }
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .time {
    font-size: small;
    color: var(--yzforum-font-color-1);
  }
}
</style>