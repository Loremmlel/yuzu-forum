<script lang="ts" setup>
const {t} = useI18n()

definePageMeta({
  layout: 'message',
  middleware: 'auth'
})

const pageData = reactive({
  page: 1,
  limit: 10,
  order: 'desc'
})

const {data, status, refresh} = await useFetch(`/api/message`, {
  method: 'GET',
  query: pageData,
  ...yzforumResponseHandler
})

onMounted(async () => {
  const hasUnreadMessage = data.value?.messages.some(message => message.status === 'unread')
  if (!hasUnreadMessage) {
    return;
  }
  await $fetch(`/api/message/system/read`, {
    method: 'PUT',
    ...yzforumResponseHandler
  })
})

useHead({
  title: `${t('seo.notice.title')} - 柚子游戏`,
  meta: [
    {
      name: 'description',
      content: t('seo.notice.description')
    }
  ]
})
</script>

<template>
  <div v-if="data" class="container">
    <header>
      <NuxtLink to="/message">
        <Icon class="icon" name="lucide:chevron-left"></Icon>
      </NuxtLink>
      <h2>{{ t('message.notice') }}</h2>
    </header>

    <YuzuDivider margin="10px 0"></YuzuDivider>

    <template v-for="(message, index) in data.messages" :key="index">
      <MessageAsideNotice :message="message" :refresh="refresh"></MessageAsideNotice>

      <YuzuDivider margin="10px 0"></YuzuDivider>
    </template>

    <YuzuNull :condition="!data.totalCount" type="null"></YuzuNull>

    <YuzuPagination v-if="data.totalCount" :limit="pageData.limit"
                    :page="pageData.page" :status="status"
                    :sum="data.totalCount" class="pagination"
                    @set-page="(newPage) => pageData.page = newPage"></YuzuPagination>
  </div>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  a {
    font-size: 24px;
    margin-right: 10px;
    color: var(--yzforum-font-color-3);
    @include yz-center;

    &:hover {
      color: var(--yzforum-blue-5);
    }
  }

  h2 {
    &::before {
      content: '';
      margin: 0;
    }
  }
}

.container {
  width: 100%;
}
</style>