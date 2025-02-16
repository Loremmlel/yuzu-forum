<script lang="ts" setup>
import {checkResetEmail, checkSendCode} from "~/components/yzgamer/utils/check";
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const hasSentCodeEmail = ref('')

const {data, refresh} = await useFetch('/api/user/email', {
  method: 'GET',
  ...yzforumResponseHandler
})

const input = reactive({
  newEmail: '',
  code: ''
})

async function handleSendCode() {
  if (!checkSendCode(input.newEmail)) {
    return
  }

  hasSentCodeEmail.value = input.newEmail
  useMessage(InfoCode.EmailVerificationSending, 'info')

  const result = await $fetch('/api/auth/email/code/reset', {
    method: 'POST',
    body: {email: input.newEmail},
    ...yzforumResponseHandler
  })

  if (result) {
    useMessage(InfoCode.ResetEmailCodeSent, 'success')
  }
}

async function handleResetEmail() {
  if (!checkResetEmail(hasSentCodeEmail.value, input.newEmail, input.code)) {
    return
  }

  const result = await $fetch('/api/user/email', {
    method: 'PUT',
    body: {email: input.newEmail, code: input.code},
    ...yzforumResponseHandler
  })
  if (result) {
    input.newEmail = ''
    input.code = ''
    useMessage(InfoCode.EmailChangeSuccess, 'success')
    await refresh()
  }
}
</script>

<template>
  <form class="email" @submit.prevent>
    <div class="title">{{ t('user.email.email') }}</div>

    <div class="current-email">
      {{ t('user.email.current') }} -> {{ data }}
    </div>

    <div class="input-container">
      <label for="email">{{ t('user.email.newEmail') }}</label>
      <YuzuInput id="email" v-model="input.newEmail" type="text"></YuzuInput>
    </div>

    <div class="input-container">
      <label for="code">{{ t('user.email.code') }}</label>
      <YuzuInput id="code" v-model="input.code" type="text"></YuzuInput>
    </div>

    <div class="button">
      <YuzuButton v-if="!hasSentCodeEmail" @click="handleSendCode">
        {{ t('user.email.send') }}
      </YuzuButton>
      <YuzuButton @click="handleResetEmail">
        {{ t('user.email.confirmEmail') }}
      </YuzuButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.email {
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
}

.title {
  margin-bottom: 36px;
}

.current-email {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.input-container {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;

  label {
    font-size: 14px;
  }

  .yuzu-input {
    margin-top: 8px;
  }
}

.button {
  display: flex;
  justify-content: space-around;
}
</style>