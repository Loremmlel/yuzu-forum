<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()
useHead({
  title: `${t('seo.register.title')} - 柚子论坛}`,
  meta: [
    {
      name: 'description',
      content: t('seo.register.description')
    }
  ]
})


function checkForm(name: string, email: string, password: string): boolean {
  if (!name.trim() || !email.trim() || !password.trim()) {
    useMessage(InfoCode.RequiredFieldsEmpty, 'warn')
    return false
  }
  if (!isValidName(name)) {
    message.info('AlertInfo.login.invalidUsername')
    return false
  }
  if (!isValidEmail(email)) {
    useMessage(InfoCode.InvalidEmail, 'warn')
    return false
  }
  if (!isValidPassword(password)) {
    message.info('AlertInfo.login.invalidPassword')
    return false
  }
  return true
}

function checkRegister(isSendCode: boolean, code: string) {
  if (!isSendCode) {
    useMessage(InfoCode.VerificationCodeNeeded, 'warn')
    return false
  }
  if (!code.trim()) {
    useMessage(InfoCode.EmptyVerificationCode2, 'warn')
    return false
  }
  if (!isValidMailConfirmCode(code)) {
    message.info('AlertInfo.login.invalidCode')
    return false
  }
  return true
}

const message = useComponentMessageStore()

const localePath = useLocalePath()
const isSendCode = ref(false)
const isAgree = ref(false)

const registerForm = reactive<Record<string, string>>({
  name: '',
  email: '',
  password: '',
  code: ''
})

function handleSendCode() {
  const result = checkForm(registerForm.name, registerForm.email, registerForm.password)
  if (!result) {
    return
  }
  if (!isAgree.value) {
    useMessage(InfoCode.AgreementRequired, 'warn')
    return
  }
  message.setPass()
  isSendCode.value = true
}

async function handleRegister() {
  if (!checkRegister(isSendCode.value, registerForm.code)) {
    return
  }

  const userInfo = await $fetch('/api/user/register', {
    method: 'POST',
    body: registerForm,
    watch: false,
    ...yzforumResponseHandler
  })

  if (userInfo) {
    message.info('AlertInfo.login.success')
    useMessage(InfoCode.RegistrationSuccess, 'success')
    usePersistUserStore().setUserInfo(userInfo)
    navigateTo(localePath('/'))
  }
}
</script>

<template>
  <div class="root">
    <div class="register">
      <form class="form" @submit.prevent>
        <NuxtImg placeholder="/placeholder.webp" preload src="/placeholder.webp"></NuxtImg>
        <div v-for="item in registerFormItem" :key="item.index" class="input-container">
          <label :for="item.value">{{ t(`register.${item.placeholder}`) }}</label>
          <YuzuInput :id="item.value" v-model="registerForm[item.value]"
                     :autocomplete="item.autocomplete" :class="item.class" :type="item.type"></YuzuInput>
        </div>
        <YuzuVerificationCode :email="registerForm.email" :name="registerForm.name" class="code"
                              style="bottom: 87px" to="register"
                              @click="handleSendCode"></YuzuVerificationCode>
        <YuzuCheckbox v-model="isAgree">
          <span>{{ t('register.agree') }}</span>
          <NuxtLink to="/agreement">{{ t('register.agreement') }}</NuxtLink>
          <NuxtLink to="/privacy">{{ t('register.privacy') }}</NuxtLink>
        </YuzuCheckbox>

        <YuzuButton @click="handleRegister">
          {{ t('register.title') }}
        </YuzuButton>
      </form>

      <YuzuDivider margin="16px 0">
        <span>{{ t('login.or') }}</span>
      </YuzuDivider>

      <div class="more">
        <NuxtLink to="/login">
          {{ t('login.title') }}
        </NuxtLink>

        <NuxtLink to="/forgot">
          {{ t('login.forgot') }}
        </NuxtLink>
      </div>
    </div>
    <YuzuFooter></YuzuFooter>
  </div>
</template>

<style lang="scss" scoped>
.root {
  flex-direction: column;
  height: 100%;
  min-height: calc(100dvh - 75px);
  max-width: 80rem;
  margin: 0 auto;
  @include yz-center;
}

.register {
  width: 360px;
  padding: 32px;
  margin-bottom: 32px;
  user-select: none;
  @include yz-blur;
}

.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  position: relative;

  img {
    width: 100%;
  }

  .input-container {
    width: 100%;

    label {
      font-size: 14px;
    }
  }

  .yuzu-input {
    width: 100%;
    margin-bottom: 8px;
    margin-top: 8px;
    padding: 12px;
  }

  .code {
    position: absolute;
    bottom: 94px;
    right: 16px;
  }

  .yuzu-checkbox {
    display: flex;
    align-items: center;
    font-size: small;
    margin-bottom: 16px;

    a {
      color: var(--yzforum-blue-5);
      text-decoration: underline;
      text-underline-offset: 3px;
      margin-left: 4px;
    }
  }

  .yuzu-button {
    width: 100%;
    background-color: var(--yzforum-blue-5);
    color: var(--yzforum-white);
    font-size: 16px;
    border-radius: 24px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

.yuzu-divider {
  span {
    margin: 0 8px;
  }
}

.more {
  display: flex;
  flex-direction: column;

  a {
    margin-bottom: 16px;
    color: var(--yzforum-blue-5);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>