<script lang="ts" setup>
import type {MessageAdmin} from "~/types/api/messageAdmin";

defineProps<{ message: MessageAdmin }>()

const {locale} = useI18n()
</script>

<template>
  <div :class="message.status === 'read' ? 'message-read' : ''" class="message">
    <div class="title">
      <div class="status">
        <Icon v-if="message.status === 'unread'" class="unread" name="lucide:info"></Icon>
        <Icon v-else class="read" name="lucide:check-check"></Icon>
      </div>
      <YuzuAvatar :user="message.admin" size="32px"></YuzuAvatar>
      <span class="time">
        {{ formatTimeDiff(message.time, locale) }}
      </span>
    </div>
  </div>

  <div class="content" v-html="getPreferredLanguageText(message.content, locale)"></div>
</template>

<style lang="scss" scoped>
.message {
  padding: 10px;
  border-radius: 5px;

  .title {
    word-break: break-all;
    display: flex;
    align-items: center;

    .status {
      display: flex;
      margin-right: 10px;
      font-size: 18px;

      .unread {
        color: var(--yzforum-red-5);
      }

      .read {
        color: var(--yzforum-blue-5);
      }
    }

    .time {
      color: var(--yzforum-font-color-0);
      font-size: small;
      font-weight: initial;
      margin-left: 20px;
      white-space: nowrap;
    }
  }

  .content {
    margin-top: 10px;
    word-break: break-all;
    line-height: 1.5rem;
  }
}
</style>