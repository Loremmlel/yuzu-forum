<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

useHead({
  title: `${t('seo.login.title')} - ${t('head.title')}`,
  meta: [
    {
      name: 'description',
      content: t('seo.login.description')
    }
  ]
})

const message = useComponentMessageStore()

function checkUsername(name: string) {
  if (!name.trim()) {
    useMessage(InfoCode.EmptyUsername, 'warn')
    return false
  }
  if (!isValidName(name) && !isValidEmail(name)) {
    message.info(t('AlertInfo.login.invalidUsername'))
    return false
  }
  return true
}

function checkPassword(password: string) {
  if (!password.trim()) {
    useMessage(InfoCode.EmptyPassword, 'warn')
    return false
  }
  if (!isValidPassword(password)) {
    message.info(t('AlertInfo.login.invalidPassword'))
    return false
  }
  return true
}

function checkLogin(name: string, password: string) {
  return checkUsername(name) && checkPassword(password)
}

const localePath = useLocalePath()
const loginForm = reactive({name: '', password: ''})

async function handleLogin() {
  const result = checkLogin(loginForm.name, loginForm.password)
  if (!result) {
    return
  }
  const userInfo = await $fetch('/api/user/login', {
    method: 'POST',
    body: loginForm,
    watch: false
  })
  if (userInfo) {
    message.info(t('AlertInfo.login.success'))
    usePersistUserStore().setUserInfo(userInfo)
    navigateTo(localePath('/'))
  }
}
</script>

<template>
  <div class="root">
    <div class="login">
      <!--表单默认提交事件会中断请求发送。困扰了我半小时，还得是d指导👍-->
      <form class="form" @submit.prevent>
        <NuxtImg placeholder="/placeholder.webp" preload src="/placeholder.webp"></NuxtImg>
        <div>
          <label for="username">{{ t('login.email') }}</label>
          <YuzuInput id="username" v-model="loginForm.name" autocomplete="username" type="text"></YuzuInput>
        </div>
        <div>
          <label for="password">{{ t('login.password') }}</label>
          <YuzuInput id="password" v-model="loginForm.password" autocomplete="current-password"
                     type="password"></YuzuInput>
        </div>
        <YuzuButton class="button" @click="handleLogin">{{ t('login.title') }}</YuzuButton>
      </form>

      <YuzuDivider margin="16px 0">
        <span>{{ t('login.or') }}</span>
      </YuzuDivider>

      <div class="more">
        <NuxtLink to="/register">
          {{ t('register.title') }}
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

.login {
  width: 360px;
  padding: 32px;
  margin-bottom: 32px;
  user-select: none;
  @include yz-blur;
}

.form {
  @include yz-center;
  flex-direction: column;
  height: 100%;

  img {
    width: 100%;
  }

  & > div {
    width: 100%;

    label {
      font-size: 14px;
    }
  }

  .yuzu-input {
    width: 100%;
    margin-bottom: 16px;
    margin-top: 8px;
    padding: 12px;
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