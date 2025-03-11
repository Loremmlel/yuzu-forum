<script lang="ts" setup>
definePageMeta({
  layout: 'message',
  middleware: 'auth'
})

const {t} = useI18n()

const pageData = reactive({
  page: 1,
  limit: 10,
  order: 'desc'
})

const {data} = await useFetch('/api/message/admin', {
  method: 'GET',
  query: pageData,
  ...yzforumResponseHandler
})

onMounted(async () => {
  const hasUnreadMessage = data.value?.some(message => message.status === 'unread')
  if (!hasUnreadMessage) {
    return
  }
  await $fetch('/api/message/admin/read', {
    method: 'PUT',
    ...yzforumResponseHandler
  })
})

useHead({
  title: `${t('seo.system.title')} - 柚子游戏`,
  meta: [
    {
      name: 'description',
      content: t('seo.system.description')
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
      <h2>{{ t('message.system') }}</h2>
    </header>
    <YuzuDivider margin="10px 0"></YuzuDivider>
    <template v-for="(message, index) in data" :key="index">
      <MessageAsideSystem :message="message"></MessageAsideSystem>
      <YuzuDivider margin="10px 0"></YuzuDivider>
    </template>
    <YuzuNull :condition="data.length === 0" type="null"></YuzuNull>
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