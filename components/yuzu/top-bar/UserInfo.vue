<script lang="ts" setup>

import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()
const localePath = useLocalePath()

const user = usePersistUserStore()
const tempSetting = useTempSettingStore()
const message = useComponentMessageStore()
const isCheckIn = ref(true)

const isShowMessageDot = computed(() => {
  return tempSetting.messageStatus === 'new';
})

const emits = defineEmits(['close'])

async function handlePanelBlur() {
  await new Promise((resolve) => {
    setTimeout(resolve, 100)
  })
  emits('close')
}

async function handleCheckIn() {
  isCheckIn.value = true
  const result = await $fetch('/api/user/checkIn', {
    method: 'POST',
    watch: false,
    ...yzforumResponseHandler
  })

  switch (result) {
    case 0:
      message.info(t('AlertInfo.check.message1'), 5000)
      break
    case 7:
      message.info(t('AlertInfo.check.message3', {points: 7}), 5000)
      break
    default:
      message.info(t('AlertInfo.check.message2', {points: result}), 5000)
  }
}

async function logout() {
  const res = await message.alert({
    'en-us': 'Are you sure you want to log out?',
    'ja-jp': 'ログアウトしてもよろしいですか？',
    'zh-cn': '您确定退出登录吗？'
  })
  if (res) {
    user.reset()
    navigateTo(localePath('/login'))
    useMessage(InfoCode.LogoutSuccess, 'success')
  }
}

const container = ref<HTMLElement>()
onMounted(async () => {
  container.value?.focus()
  const result = await $fetch('/api/user/status', {
    method: 'GET',
    watch: false,
    ...yzforumResponseHandler
  })
  if (result) {
    isCheckIn.value = result.isCheckIn
    user.point = result.points
  }
})
</script>

<template>
  <div ref="container" class="container" tabindex="-1" @blur="handlePanelBlur" @mousedown.passive="container?.focus()">
    <span class="triangle1"></span>
    <span class="triangle2"></span>

    <div class="yzgamer">
      <div class="info">
        <p>{{ user.name }}</p>
        <p>
          <span><Icon class="icon" name="lucide:lollipop"></Icon></span>
          <span>{{ user.point }}</span>
        </p>
      </div>

      <div class="func">
        <span>
          <NuxtLinkLocale :to="`/yzgamer/${user.uid}/info`">
            {{ t('header.user.profile') }}
          </NuxtLinkLocale>
        </span>

        <NuxtLinkLocale to="/message">
          <span>{{ t('header.user.message') }}</span>
          <span v-if="isShowMessageDot" class="message-dot"></span>
        </NuxtLinkLocale>

        <span v-if="!isCheckIn" @click="handleCheckIn">
          <span>{{ t('header.user.check') }}</span>
          <span class="message-dot"></span>
        </span>

        <span @click="logout">{{ t('header.user.logout') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 50px;
  right: 80px;
}

.triangle1 {
  position: absolute;
  top: -1px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 18px solid var(--yzforum-trans-white-5);
  filter: drop-shadow(0 -1px 1px var(--yzforum-blue-3));
  z-index: 1;
}

.yzgamer {
  padding: 10px;
  top: 16px;
  transform: translateX(-45%);
  width: 140px;
  position: absolute;
  display: flex;
  flex-direction: column;

  @include yz-blur;
}

.info {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;

  p {
    display: flex;
    margin-bottom: 5px;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 5px;
      font-weight: bold;
      color: var(--yzforum-pink-4);

      &:nth-child(1) {
        font-size: 20px;
      }
    }
  }
}

.func {
  & > span,
  a {
    position: relative;
    cursor: pointer;
    color: var(--yzforum-blue-5);
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;

    a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--yzforum-blue-5);
    }

    &:hover {
      background-color: var(--yzforum-trans-blue-1);
    }
  }
}

.message-dot {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--yzforum-pink-4);
}
</style>