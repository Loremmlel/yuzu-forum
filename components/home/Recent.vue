<script lang="ts" setup>
import type {HomeMessage} from "~/types/api/home";

const iconMap: Record<string, string> = {
  upvoted: 'lucide:sparkles',
  replied: 'lucide:reply',
  commented: 'uil:comment-dots',
  requested: 'lucide:git-pull-request-arrow'
}
const {locale, t} = useI18n()

const messageData = ref<HomeMessage[] | null>()
const pageData = reactive({
  page: 1,
  limit: 10
})

const {data, status} = await useFetch('/api/home/message', {
  method: 'GET',
  query: pageData
})
messageData.value = data.value

watch(
    () => [pageData.page, status.value],
    () => {
      if (data.value && status.value !== 'pending' && pageData.page > 1) {
        messageData.value = messageData.value?.concat(data.value)
      }
    }
)

function handleClose() {
  messageData.value = messageData.value?.slice(0, 10)
  pageData.page = 1
}
</script>

<template>
  <div v-if="messageData" class="recent">
    <div v-for="(message, index) in messageData" :key="index" class="message">
      <Icon :name="iconMap[message.type]" class="icon"></Icon>
      <NuxtLinkLocale :to="`/yzgamer/${message.uid}`" class="user">
        {{ message.name }}
      </NuxtLinkLocale>
      <NuxtLinkLocale :to="message.tid ? `/topic/${message.tid}` : `/game/${message.gid}`" class="link">
        <span>{{ message.content }}</span>
        <span>{{ formatTimeDiff(message.time, locale) }}</span>
      </NuxtLinkLocale>
    </div>
  </div>

  <HomeLoader v-model="pageData.page" :status="status">
    <span v-if="pageData.page !== 1" class="close" @click="handleClose">
      {{ t('home.fold') }}
    </span>
  </HomeLoader>
</template>

<style lang="scss" scoped>
.recent {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  font-size: 16px;
}

.message {
  margin-bottom: 8px;
  word-break: break-all;

  .user {
    color: var(--yzforum-font-color-3);

    &::after {
      content: '-';
      color: var(--yzforum-gray-4);
      margin: 0 4px;
    }
  }

  .icon {
    margin-right: 5px;
    color: var(--yzforum-blue-5);
  }

  .link {
    color: var(--yzforum-font-color-0);

    &:hover {
      color: var(--yzforum-blue-5);
    }

    span:last-child {
      font-size: 12px;
      font-weight: inherit;
      margin-left: 8px;
    }
  }
}

.close {
  margin-left: 20px;
  cursor: pointer;
  padding-right: 20px;

  &:hover {
    color: var(--yzforum-blue-5);
  }
}

@media (max-width: 700px) {
  .recent {
    font-size: 15px;
  }
}
</style>