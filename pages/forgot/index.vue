<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

useHead({
  title: `${t('seo.forgot.title')} - 柚子游戏`,
  meta: [
    {
      name: 'description',
      content: t('seo.forgot.description')
    }
  ]
})

const message = useComponentMessageStore()

function checkEmail(email: string) {
  if (!email.trim()) {
    useMessage(InfoCode.EmptyEmail, 'warn')
    return false
  }
  if (email.trim().length > 100) {
    useMessage(InfoCode.EmailLengthExceeded, 'warn')
    return false
  }
  if (!isValidEmail(email)) {
    useMessage(InfoCode.IllegalEmailFormat, 'warn')
    return false
  }
  return true
}

const checkCode = (email: string, code: string) => {
  if (!checkEmail(email)) {
    return false
  }

  if (!isValidMailConfirmCode(code)) {
    useMessage(InfoCode.InvalidVerificationFormat, 'warn')
    return false
  }

  return true
}

const checkPassword = (newPassword: string, confirmPassword: string) => {
  if (!newPassword) {
    useMessage(InfoCode.EmptyNewPasswordAuth, 'warn')
    return false
  }
  if (!confirmPassword) {
    useMessage(InfoCode.ConfirmPasswordEmpty, 'warn')
    return false
  }

  if (newPassword !== confirmPassword) {
    useMessage(InfoCode.PasswordConfirmMismatch, 'warn')
    return false
  }

  if (!isValidPassword(confirmPassword) || !isValidPassword(newPassword)) {
    useMessage(InfoCode.IllegalPasswordFormat, 'warn', 8000)
    return false
  }
  return true
}

const forgotForm = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})
const localePath = useLocalePath()
const flag = ref(true)
const isSendCode = ref(false)

function handleClickSendCode() {
  if (!checkEmail(forgotForm.email)) {
    return
  }
  isSendCode.value = true
  message.setPass()
}

function handleClickNext() {
  if (!checkCode(forgotForm.email, forgotForm.code)) {
    return
  }
  flag.value = false
}

function handleClickPrev() {
  flag.value = true
}

async function handleChangePassword() {
  if (!checkPassword(forgotForm.newPassword, forgotForm.confirmPassword)) {
    return
  }
  const res = await message.alert({
    'en-us': 'Are you sure you want to change the password?',
    'ja-jp': 'パスワードを変更してもよろしいですか？',
    'zh-cn': '您确定更改密码吗?'
  })
  if (!res) {
    return
  }
  const data = await $fetch('/api/auth/password/reset', {
    method: 'POST',
    body: forgotForm,
    ...yzforumResponseHandler
  })

  if (data) {
    navigateTo(localePath('/login'))
    useMessage(InfoCode.PasswordChangeSuccess, 'success')
  } else {
    useMessage(InfoCode.VerificationCodeNeeded, 'warn')
  }
}
</script>

<template>
  <div class="root">
    <div class="container">
      <div class="title">{{ t('forgot.title') }}</div>
      <Transition mode="out-in" name="slide">
        <form v-if="flag" @submit.prevent>
          <div class="input-container">
            <label for="email">{{ t('forgot.email') }}</label>
            <YuzuInput id="email" v-model="forgotForm.email" autocomplete="email" type="text"></YuzuInput>
          </div>
          <div class="input-container">
            <label for="code">{{ t('forgot.code') }}</label>
            <YuzuInput id="code" v-model="forgotForm.code" type="text"></YuzuInput>
          </div>
        </form>

        <form v-else class="password" @submit.prevent>
          <input autocomplete="username" hidden type="text">

          <div class="input-container">
            <label for="new-password">{{ t('forgot.new') }}</label>
            <YuzuInput id="new-password" v-model="forgotForm.newPassword"
                       autocomplete="new-password" type="password"></YuzuInput>
          </div>
          <div class="input-container">
            <label for="new-password">{{ t('forgot.rePwd') }}</label>
            <YuzuInput id="password" v-model="forgotForm.confirmPassword"
                       autocomplete="new-password" type="password"></YuzuInput>
          </div>
        </form>
      </Transition>

      <div class="button">
        <YuzuVerificationCode v-if="flag" :email="forgotForm.email" class="code"
                              to="forgot" @click="handleClickSendCode"></YuzuVerificationCode>
        <YuzuButton v-if="flag" @click="handleClickNext">{{ t('forgot.next') }}</YuzuButton>
        <YuzuButton v-if="!flag" @click="handleClickPrev">{{ t('forgot.prev') }}</YuzuButton>
        <YuzuButton v-if="!flag" @click="handleChangePassword">{{ t('forgot.confirm') }}</YuzuButton>
      </div>
      <div class="nav">
        <YuzuBackToPrevious></YuzuBackToPrevious>
        <YuzuBackToHome></YuzuBackToHome>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.root {
  height: calc(100vh - 75px);
  width: 100vw;
  display: flex;
  color: var(--yzforum-font-color-3);
}

.container {
  margin: auto;
  width: 360px;
  @include yz-blur;
}

.title {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  font-size: large;
  background-color: var(--yzforum-blue-5);
  border-radius: 10px 10px 0 0;
  color: var(--yzforum-white);
}

.nav {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

@media (max-width: 700px) {
  .root {
    min-height: calc(100dvh - 63px);
  }
}

form {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  margin-top: 50px;
}

.input-container {
  padding: 0 10px;
  margin-bottom: 30px;
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
  align-items: center;
}

.slide-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>