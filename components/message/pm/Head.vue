<script setup lang="ts">
const {t} = useI18n()

const props = defineProps<{uid: number}>()

const socket = useSocketIO()

// 这个组件只会被用在ClientOnly内
const res = await $fetch(`/api/user/${props.uid}`, {
  method: 'GET',
  ...yzforumResponseHandler
})

const user = {
  uid: props.uid,
  name: typeof res !== 'string' ? res.name : '',
  avatar: typeof res !== 'string' ? res.avatar : '',
}

const handleReload = () => location.reload()
</script>

<template>
  <header>
   <NuxtLink to="/message">
     <Icon class="icon" name="lucide:chevron-left"></Icon>
   </NuxtLink>
    <YuzuAvatar :user="user" size="30px"></YuzuAvatar>
    <h2 class="username">
      <span>{{user.name}}</span>
      <span class="status" :class="socket.connected ? 'connected' : 'disconnected'"></span>
      <span class="offline" v-if="!socket.connected" @click="handleReload" v-tooltip="{
        message: {
            'en-us': `Click to refresh the page, but it's okay if you don't refresh it.`,
            'ja-jp': 'クリックしてページを更新、更新しなくても大丈夫です',
            'zh-cn': '点击刷新页面, 不刷新也可以'
          },
          position: 'bottom'
      }">
        <span>{{t('message.offline')}}</span>
        <Icon class="icon" name="lucide:refresh-cow"></Icon>
      </span>
    </h2>
  </header>
</template>

<style scoped lang="scss">
header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
  height: 32px;

  a {
    font-size: 24px;
    margin-right: 10px;
    color: var(--yzforum-font-color-3);
    @include yz-center;

    &:hover {
      color: var(--yzforum-blue-5);
    }
  }

  .username {
    margin-left: 10px;
    position: relative;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      margin: 0;
    }
  }

  .status {
    position: absolute;
    right: -24px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .connected {
    background-color: var(--yzforum-green-4);
  }

  .disconnected {
    background-color: var(--yzforum-red-4);
  }

  .offline {
    margin-left: 10px;
    font-size: initial;
    font-weight: 500;
    color: var(--yzforum-font-color-0);
    cursor: pointer;

    span {
      &:last-child {
        margin-left: 4px;
      }
    }
  }
}
</style>