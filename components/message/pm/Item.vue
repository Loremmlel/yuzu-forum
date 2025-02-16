<script lang="ts" setup>
import type {Message} from "~/types/api/chatMessage";

const {locale} = useI18n()

defineProps<{ message: Message, isSent: boolean }>()
</script>

<template>
  <div :class="isSent ? 'sent' : 'others'" class="message-item">
    <YuzuAvatar :user="message.sender" size="30px"></YuzuAvatar>
    <div class="content-container">
      <div class="top">
        <span class="username">
          {{ message.sender.name }}
        </span>
      </div>
      <div class="content">
        <span>{{ message.content }}</span>
        <span class="time">
          {{ formatTimeDiff(message.time, locale) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-item {
  display: flex;
  width: 100%;

  .yuzu-avatar {
    margin-top: auto;
  }

  .top {
    display: flex;
    align-items: end;
  }

  .username {
    color: var(--yzforum-pink-4);
  }
}

.content-container {
  background-color: var(--yzforum-trans-white-5);
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 75%;
  font-size: 14px;
  margin: 0 10px;
  position: relative;
  line-height: 1.4;
  box-shadow: var(--shadow);

  .time {
    font-size: 12px;
    margin-left: 10px;
    margin-right: 5px;
    color: var(--yzforum-font-color-1);
  }

  .icon {
    transform: translateY(3px);
    color: var(--yzforum-font-color-1);
  }
}

.message-item + .message-item {
  margin-top: 5px;
}

.sent + .others,
.others + .sent {
  margin-top: 10px;
}

.sent {
  justify-content: flex-start;
  flex-direction: row-reverse;

  .content-container {
    background-color: var(--yzforum-trans-blue-2);
  }

  .username {
    color: var(--yzforum-blue-5);
  }
}
</style>