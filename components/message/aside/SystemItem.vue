<script setup lang="ts">
import type {AsideItem} from "~/types/api/chatMessage";

const {locale} = useI18n()

defineProps<{ title: string, data: AsideItem }>()
</script>

<template>
  <NuxtLink class="item" :to="`/message/${data.route as 'system' | 'notice'}`">
    <NuxtImg src="/apple-touch-icon.png"></NuxtImg>
    <div class="info">
      <div class="title">
        <span class="name">{{ title }}</span>
        <span class="time" v-if="data.time">
          {{ formatTimeDiff(data.time, locale) }}
        </span>
      </div>
      <div class="content">
        <slot name="system"></slot>
        <span class="preview">
          {{ markdownToText(data.content) }}
        </span>
        <span v-if="data.unreadCount" class="unread">
          {{ data.unreadCount }}
        </span>
        <span v-else class="read">{{ data.count }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.item {
  display: flex;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--yzforum-font-color-3);

  img {
    height: 50px;
    width: 50px;
  }

  &:hover {
    background-color: var(--yzforum-trans-blue-0);
  }
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 10px;
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      font-weight: bold;
    }

    .time {
      font-size: small;
      color: var(--yzforum-font-color-0);
    }
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: small;
    }

    .preview {
      color: var(--yzforum-font-color-0);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }

    .read,
    .unread {
      margin-left: auto;
      font-size: 12px;
      background-color: var(--yzforum-gray-4);
      color: var(--yzforum-white);
      border-radius: 10px;
      padding: 2px 4px;
    }

    .unread {
      background-color: var(--yzforum-blue-5);
    }
  }
}

@media (max-width: 700px) {
  .item {
    width: 100%;
  }
}
</style>