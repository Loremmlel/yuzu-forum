<script lang="ts" setup>
import {asideItems} from "~/components/message/aside/items";

const {t} = useI18n()

const {data: system} = await useFetch(`/api/message/nav/system`, {
  method: 'GET',
  key: 'message-system',
  ...yzforumResponseHandler
})

const {data: contact} = await useFetch(`/api/message/nav/contact`, {
  method: 'GET',
  key: 'message-contact',
  ...yzforumResponseHandler
})

asideItems.value = contact.value ? contact.value : []
</script>

<template>
  <aside>
    <h2>{{ t('message.name') }}</h2>
    <YuzuDivider margin="10px 0"></YuzuDivider>

    <MessageAsideSystemItem v-if="system" :data="system[0]" :title="t('message.notice')"></MessageAsideSystemItem>

    <MessageAsideSystemItem v-if="system" :data="system[1]" :title="t('message.system')">
      <template #system>
        <span v-if="!system[1].unreadCount" class="zako">
          {{ t('topic.panel.reply') }}
        </span>
        <span v-else class="new">
          {{ `「 ${t('message.new')} 」` }}
        </span>
      </template>
    </MessageAsideSystemItem>

    <MessageAsideItem v-for="(room, index) in asideItems" :key="index" :room="room"></MessageAsideItem>

    <div class="notice">
      <MessageNotice></MessageNotice>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.aside {
  height: 100%;
  width: 32rem;
  color: var(--yzforum-font-color-3);
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }

  @include yz-blur;
}

span {
  font-size: small;
}

.zako {
  color: var(--yzforum-font-color-0);
}

.new {
  color: var(--yzforum-red-5);
}

.notice {
  display: none;
}

@media (max-width: 700px) {
  .aside {
    width: 100%;
  }

  .notice {
    display: block;
  }
}
</style>