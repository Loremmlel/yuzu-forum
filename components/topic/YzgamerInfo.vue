<script setup lang="ts">
defineProps<{
  user: {
    uid: number
    name: string
    avatar: string
    point: number
  }
}>()
</script>

<template>
  <div class="yzgamer">
    <div class="avatar" v-if="user.avatar">
      <NuxtLink :aria-label="`Yuzu Game Forum, 柚子游戏论坛, 用户 ${user.name}`"
                :to="`/yzgamer/${user.uid}/info`">
        <img :src="user.avatar" :alt="user.name">
      </NuxtLink>
    </div>

    <div class="info">
      <div class="replier">
        <p class="name">
          <NuxtLink :aria-label="`Yuzu Game Forum, 柚子游戏论坛, 用户 ${user.name}`"
                    :to="`/yzgamer/${user.uid}/info`">
            {{ user.name }}
          </NuxtLink>
        </p>

        <p class="point">
          <span><Icon class="icon" name="lucide:lollipop"></Icon></span>
          <span>{{user.point}}</span>
        </p>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.yzgamer {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  margin-bottom: 20px;
  color: var(--yzforum-font-color-3);
}

.avatar {
  width: 100px;
  margin-top: 20px;
  aspect-ratio: 1/1;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 100px;
    object-fit: cover;
  }
}

.info {
  width: 100px;
}

.name {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-size: 18px;
  word-break: break-word;

  a {
    color: var(--yzforum-blue-5);
    border-bottom: 2px solid transparent;

    &:hover {
      border-bottom: 2px solid var(--yzforum-blue-5);
    }
  }
}

.point {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--yzforum-pink-4);

  span {
    display: flex;
    justify-content: center;
    align-items: center;

    &:nth-child(1) {
      font-size: 20px;
    }
  }
}

@media (max-width: 700px) {
  .yzgamer {
    flex-direction: row;
    margin-bottom: 0;
    padding: 0 10px;
  }

  .avatar {
    width: 70px;
    height: 70px;
    flex-shrink: 0;

    img {
      width: 70px;
    }
  }

  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .replier {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
}
</style>