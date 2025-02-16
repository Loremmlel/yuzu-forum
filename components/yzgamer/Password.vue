<script lang="ts" setup>
import {checkChangePassword} from "~/components/yzgamer/utils/check";
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const localePath = useLocalePath()

const input = reactive({
  oldPassword: '',
  newPassword: '',
  repeatPassword: ''
})

async function handleChangePassword() {
  if (!checkChangePassword(input.oldPassword, input.newPassword, input.repeatPassword)) {
    return
  }

  const res = await useComponentMessageStore().alert({
    'en-us': 'Are you sure you want to change the password?',
    'ja-jp': 'パスワードを変更してもよろしいですか？',
    'zh-cn': '确定更改密码吗?'
  })
  if (!res) {
    return
  }

  const result = await $fetch('/api/user/password', {
    method: 'PUT',
    body: {oldPassword: input.oldPassword, newPassword: input.newPassword},
    ...yzforumResponseHandler
  })

  if (result) {
    usePersistUserStore().reset()
    navigateTo(localePath('/login'))
    useMessage(InfoCode.PasswordResetSuccess, 'success')
  }
}
</script>

<template>
  <form class="password" @submit.prevent>
    <div class="title">{{ t('user.email.pwd') }}</div>
    <input autocomplete="username" hidden type="text">

    <div class="input-container">
      <label for="old-password">{{ t('user.email.oldPwd') }}</label>
      <YuzuInput id="old-password" v-model="input.oldPassword"
                 autocomplete="current-password" type="password"></YuzuInput>
    </div>

    <div class="input-container">
      <label for="new-password">{{ t('user.email.newPwd') }}</label>
      <YuzuInput id="new-password" v-model="input.newPassword"
                 autocomplete="new-password" type="password"></YuzuInput>
    </div>

    <div class="input-container">
      <label for="repeat-password">{{ t('user.email.rePwd') }}</label>
      <YuzuInput id="repeat-password" v-model="input.repeatPassword"
                 autocomplete="new-password" type="password"></YuzuInput>
    </div>

    <div class="button">
      <YuzuButton @click="handleChangePassword">
        {{ t('user.email.confirmPwd') }}
      </YuzuButton>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.title {
  margin-bottom: 36px;
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

.password {
  margin-bottom: 16px;
}
</style>