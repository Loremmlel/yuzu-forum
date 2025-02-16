<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const message = useComponentMessageStore()

const refresh = inject<() => Promise<void>>('refresh')
const inputValue = ref('')

async function handleChangeUsername() {
  if (!isValidName(inputValue.value)) {
    useMessage(InfoCode.InvalidUsername, 'warn')
    return
  }

  const res = await message.alert({
    'en-us': 'Are you sure you want to change your username? This will cost you 17 points.',
    'ja-jp': 'ユーザー名を変更してもよろしいですか？これには 17 ポイントが必要です。',
    'zh-cn': '您确定更改用户名吗？这将会消耗您 17 柚子点',
  })
  if (!res) {
    return
  }

  useMessage(InfoCode.UsernameUpdating, 'info')
  const result = await $fetch('/api/user/username', {
    method: 'PUT',
    watch: false,
    body: {username: inputValue.value},
    ...yzforumResponseHandler
  })

  if (result) {
    useMessage(InfoCode.UsernameUpdateSuccess, 'success')
    await refresh?.()
  }
}
</script>

<template>
  <div class="username">
    <div class="title">{{ t('user.settings.username') }}</div>
    <p>{{ t('user.settings.usernameHint') }}</p>
    <YuzuInput v-model="inputValue" type="text"></YuzuInput>
    <YuzuButton @click="handleChangeUsername">
      {{ t('user.settings.confirm') }}
    </YuzuButton>
  </div>
</template>

<style lang="scss" scoped>
p {
  margin: 10px 0;
  font-size: 14px;
}

input {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>