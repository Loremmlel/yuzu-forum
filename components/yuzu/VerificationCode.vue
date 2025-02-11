<script setup lang="ts">
const props = defineProps<{
  to: 'register' | 'forgot'
  name?: string
  email: string
}>()

const {t} = useI18n()

const message = useComponentMessageStore()

const isSendCode = ref(false)
const isSending = ref(false)
const countdown = ref(0)

async function sendCode() {
  const url = props.to === 'register' ? '/api/auth/email/register' : '/api/auth/email/forgot'
  const body = props.to === 'register' ? {email: props.email, name: props.name} : {email: props.email}
  return await $fetch(url, {
    method: 'POST',
    body,
    ...yzforumResponseHandler
  })
}

watch(
    () => isSendCode.value,
    async () => {
      if (!isSending.value) {
        isSending.value = true
        countdown.value = 30

        const countdownInterval = setInterval(() => {
          countdown.value -= 1
          if (countdown.value === 0) {
            clearInterval(countdownInterval)
            isSending.value = false
          }
        }, 1000)

        const result = await sendCode()

        if (result) {
          message.info('AlertInfo.code.code')
        } else {
          isSending.value = false
        }
      }
    }
)

function handleSendCode() {
  isSendCode.value = !isSendCode.value
}
</script>

<template>
  <button @click="handleSendCode" :disabled="isSending">
    {{ isSending ? countdown : t('register.send') }}
  </button>
</template>

<style scoped lang="scss">
button {
  width: 90px;
  height: 30px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: var(--yzforum-font-color-1);

  &:hover {
    color: var(--yzforum-blue-5);
  }
}
</style>