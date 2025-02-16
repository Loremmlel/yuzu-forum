<script setup lang="ts">
import {asideItems} from "~/components/message/aside/item";

const {t} = useI18n()

const { data: system } = await useFetch(`/api/message/nav/system`, {
  method: 'GET',
  ...yzforumResponseHandler
})

const { data: contact } = await useFetch(`/api/message/nav/contact`, {
  method: 'GET',
  ...yzforumResponseHandler
})

asideItems.value = contact.value ? contact.value : []
</script>

<template>
  <aside>
    <h2>{{t('message.name')}}</h2>
    <YuzuDivider margin="10px 0"></YuzuDivider>

    <MessageAsideSystemItem v-if="system" :title="t('message.notice')" :data="system[0]"></MessageAsideSystemItem>

    <MessageAsideSystemItem v-if="system" :title="t('message.system')" :data="system[1]">
      <template #system>
        <span class="zako" v-if="!system[1].unreadCount">
          {{t('topic.panel.reply')}}
        </span>
        <span class="new" v-else>
          {{`「 ${t('message.new')} 」`}}
        </span>
      </template>
    </MessageAsideSystemItem>

    <MessageAsideItem v-for="(room, index) in asideItems" :key="index" :room="room"></MessageAsideItem>

    <div class="notice">
      <MessageNotice></MessageNotice>
    </div>
  </aside>
</template>

<style scoped lang="scss">
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