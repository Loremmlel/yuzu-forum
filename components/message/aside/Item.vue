<script setup lang="ts">
import type {AsideItem} from "~/types/api/chatMessage";

const {locale} = useI18n()

defineProps<{ room: AsideItem }>()
</script>

<template>
  <NuxtLink class="item" :to="`/message/user/${room.route}`">
    <YuzuAvatar :user="{uid: parseInt(room.route), avatar: room.avatar, name: room.title}" size="50px"></YuzuAvatar>
    <div class="info">
      <div class="title">
        <span>{{ room.title }}</span>
        <span v-if="room.time">
          {{ formatTimeDiff(room.time, locale) }}
        </span>
      </div>
      <div class="content">
        <slot name="system"></slot>
        <span class="preview">
          {{ markdownToText(room.content) }}
        </span>
        <span v-if="room.unreadCount" class="unread">
          {{ room.unreadCount }}
        </span>
        <span v-if="!room.unreadCount" class="read">{{ room.count }}</span>
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

    span {
      &:first-child {
        font-weight: bold;
      }

      &:last-child {
        font-size: small;
        color: var(--yzforum-font-color-0);
      }
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
</style>