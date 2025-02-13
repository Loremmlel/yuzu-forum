<script setup lang="ts">
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const userStore = usePersistUserStore()
const tempReplyStore = useTempReplyStore()
const persistReplyStore = usePersistYzforumReplyStore()

const props = defineProps<{
  toUsername: string,
  toUid: number,
  toFloor: number
}>()

function handleClickReply() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToReply, 'warn', 5000)
    return
  }

  persistReplyStore.replyDraft.toUsername = props.toUsername
  persistReplyStore.replyDraft.toUid = props.toUid
  persistReplyStore.replyDraft.toFloor = props.toFloor

  tempReplyStore.isEdit = true
}
</script>

<template>
  <div @click="handleClickReply" class="reply">
    {{ t('topic.content.reply') }}
  </div>
</template>

<style scoped lang="scss">
.reply {
  position: relative;
  width: 70px;
  height: 30px;
  @include yz-center;
  color: var(--yzforum-blue-5);
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 10px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
    border: 2px solid transparent;
    box-sizing: border-box;
  }
  &:hover {
    color: var(--yzforum-pink-4);

    &::before {
      transition: width 0.2s, height 0.2s, border-bottom-color 0s;
      transition-delay: 0.2s, 0s, 0.2s;
      width: 70px;
      height: 30px;
      border-left: 2px solid var(--yzforum-pink-4);
      border-bottom: 2px solid var(--yzforum-pink-4);
    }

    &::after {
      transition: width 0.2s, height 0.2s, border-right-color 0.2s;
      transition-delay: 0s, 0.2s, 0.2s;
      width: 70px;
      height: 30px;
      border-top: 2px solid var(--yzforum-pink-4);
      border-right: 2px solid var(--yzforum-pink-4);
    }
  }
}

@media (max-width: 700px) {
  .reply {
    margin-right: 0;
  }
}
</style>