<script lang="ts" setup>
import type {Message} from "~/types/api/chatMessage";
import {InfoCode} from "~/code&message/infoCode";
import {replaceAsideItem} from "~/components/message/aside/items";

const {t} = useI18n()

const props = defineProps<{ uid: number }>()

const socket = useSocketIO()
useSocketIOErrorHandler()

const historyContainer = ref<HTMLDivElement | null>(null)
const messageInput = ref('')
const messages = ref<Message[]>([])
const isLoadHistoryMessageComplete = ref(false)
const showLoader = computed(() => {
  if (isLoadHistoryMessageComplete.value) {
    return false
  }
  return messages.value.length >= 30
})
const currentUserUid = usePersistUserStore().uid
const toUid = props.uid
const pageData = reactive({
  page: 1,
  limit: 30
})

function scrollToBottom() {
  if (historyContainer.value) {
    historyContainer.value.scrollTo({
      top: historyContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

function sendMessage() {
  if (!messageInput.value.trim()) {
    useMessage(InfoCode.EmptyMessage, 'warn')
    return
  }
  if (messageInput.value.length > 1007) {
    useMessage(InfoCode.MessageLengthExceeded, 'warn')
    return
  }
  socket.emit('message:sending', toUid, messageInput.value)
}

async function getMessageHistory() {
  const histories = await $fetch('/api/message/chat/history', {
    method: 'GET',
    query: {receiverUid: toUid, ...pageData},
    watch: false,
    ...yzforumResponseHandler
  })
  const results = Array.isArray(histories) ? histories : []
  return results as Message[]
}

watch(
    () => messages.value,
    () => scrollToBottom()
)

onMounted(async () => {
  socket.emit('private:join', toUid)
  socket.on('message:sent', (newMessage: Message) => {
    messages.value.push(newMessage)
    replaceAsideItem(newMessage)
    messageInput.value = ''
    nextTick(() => scrollToBottom())
  })
  socket.on('message:received', (message: Message) => {
    if (message.receiverUid !== currentUserUid || message.sender.uid === currentUserUid) {
      return
    }
    messages.value.push(message)
    replaceAsideItem(message)
    nextTick(() => scrollToBottom())
  })
  messages.value = await getMessageHistory()
  window.addEventListener('keydown', onKeydown)
  await nextTick(() => scrollToBottom())
})

async function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  socket.emit('private:leave')
})

async function handleLoadHistoryMessages() {
  if (!historyContainer.value) {
    return
  }

  const prevScrollHeight = historyContainer.value.scrollHeight
  const prevScrollTop = historyContainer.value.scrollTop

  pageData.page++
  const histories = await getMessageHistory()

  if (histories.length === 0) {
    isLoadHistoryMessageComplete.value = true
    return
  }
  messages.value.unshift(...histories)
  await nextTick(() => {
    if (!historyContainer.value) {
      return
    }
    const newScrollHeight = historyContainer.value.scrollHeight
    historyContainer.value.scrollTo({
      top: prevScrollTop + (newScrollHeight - prevScrollHeight)
    })
  })
}
</script>

<template>
  <div ref="historyContainer" class="history">
    <div v-if="showLoader" class="loader" @click="handleLoadHistoryMessages">
      {{ t('message.history') }}
    </div>
    <YuzuNull :condition="!showLoader && messages.length > 30" type="null"></YuzuNull>
    <template v-if="messages.length">
      <MessagePmItem v-for="(message, index) in messages" :key="index" :is-sent="toUid !== message.sender.uid"
                     :message="message" class="message-item"></MessagePmItem>
    </template>
    <YuzuNull :condition="!messages.length" type="null"></YuzuNull>
  </div>

  <div class="send-container">
    <YuzuInput v-model="messageInput"></YuzuInput>
    <YuzuButton @click="sendMessage">
      <Icon class="icon" name="lucide:send"></Icon>
    </YuzuButton>
  </div>
</template>

<style lang="scss" scoped>
.send-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  .yuzu-input {
    width: 100%;
    margin-right: 10px;
    border: 1.5px solid var(--yzforum-blue-5);
  }

  .icon {
    font-size: 24px;
    @include yz-center;
  }
}

.history {
  overflow-y: scroll;
  padding-bottom: 16px;

  .loader {
    margin: 16px 0;
    color: var(--yzforum-font-color-0);
    cursor: pointer;
    @include yz-center;

    &:hover {
      color: var(--yzforum-blue-5);
    }
  }
}
</style>