<script lang="ts" setup>
import type {Message} from "~/types/api/message";
import {InfoCode} from "~/code&message/infoCode";
import {getMessageI18n} from "../utils/getMessageI18n";

const props = defineProps<{ message: Message, refresh: () => Promise<void> }>()

const {locale, t} = useI18n()

const handleDeleteMessage = async (mid: number) => {
  const res = await useComponentMessageStore().alert({
    'en-us': 'Are you sure you want to delete this message? This action cannot be undone.',
    'ja-jp': 'メッセージを削除してもよろしいですか？この操作は元に戻せません。',
    'zh-cn': '您确定要删除这条消息吗？此操作不可撤销。'
  })
  if (!res) {
    return
  }

  const result = await $fetch(`/api/message/delete`, {
    method: 'DELETE',
    query: {mid},
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    await props.refresh()
    useMessage(InfoCode.DeleteNotificationSuccess, 'success')
  }
}
</script>

<template>
  <div :class="message.status === 'read' ? 'message-read' : ''" class="message">
    <div class="title">
      <div class="status">
        <Icon v-if="message.status === 'unread'" class="unread" name="lucide:info"></Icon>
        <Icon v-else class="read" name="lucide:check-check"></Icon>
      </div>
      <div>
        <NuxtLink :to="`/yzgamer/${message.sender.uid}/info`">
          {{ message.sender.name }}
        </NuxtLink>
        <span>{{ getMessageI18n(locale, message) }}</span>
      </div>
    </div>

    <div class="content">
      <YuzuAvatar :user="message.sender" size="32px"></YuzuAvatar>

      <NuxtLink :to="message.tid ? `/topic/${message.tid}` : `/game/${message.gid}`" class="link">
        <pre class="detail">{{ markdownToText(message.content) }}</pre>
      </NuxtLink>
    </div>
    <div class="bottom">
      <span class="time">
        {{ formatDate(message.time, locale, {showYear: true, isPrecise: true}) }}
      </span>
      <span @click="handleDeleteMessage(message.mid)">
        <Icon class="icon" name="lucide:trash-2"></Icon>
      </span>
    </div>
  </div>
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
        color: var(--yzforum-pink-4);
      }

      .read {
        color: var(--yzforum-blue-5);
      }
    }

    a {
      color: var(--yzforum-blue-5);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .content {
    display: flex;
    margin: 10px 0;
  }

  .bottom {
    display: flex;
    justify-content: space-between;

    span {
      &:first-child {
        user-select: none;
        font-size: small;
        color: var(--yzforum-font-color-0);
      }

      &:last-child {
        cursor: pointer;
        font-size: 18px;
        color: var(--yzforum-red-5);
      }
    }
  }
}

.link {
  cursor: pointer;
  color: var(--yzforum-font-color-2);

  &:hover {
    color: var(--yzforum-blue-5);
  }
}

.detail {
  margin: 0 0 0 10px;
  padding: 5px;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>