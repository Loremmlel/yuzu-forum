<script lang="ts" setup>
const {t} = useI18n()
const localePath = useLocalePath()

const user = usePersistUserStore()
const tempSetting = useTempSettingStore()

function onKeydown(event: KeyboardEvent) {
  if (event.ctrlKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    navigateTo(localePath('/search'))
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="yzgamer-info">
    <NuxtLinkLocale v-tooltip="{
      message: {
        'en-us': 'Press Ctrl + K to search',
        'ja-jp': 'Ctrl + K を押して検索',
          'zh-cn': '按下 Ctrl + K 以搜索'
      },
      position: 'bottom'
    }" aria-label="search" class="search" to="/search">
      <Icon class="icon" name="lucide:search"></Icon>
    </NuxtLinkLocale>

    <span class="settings" @click="tempSetting.showYzforumPanel = !tempSetting.showYzforumPanel">
      <Icon class="icon" name="uiw:setting-o"></Icon>
    </span>

    <div v-if="user.name" class="avatar">
      <div>
        <NuxtImg v-if="user.avatarMin" :alt="user.name"
                 :src="user.avatarMin"
                 class="avatar-image" @click="tempSetting.showYzforumUserPanel = true"></NuxtImg>
        <!--头像右下角小图标，表示用户状态-->
        <div :class="tempSetting.messageStatus" class="status"></div>
      </div>
      <span v-if="!user.avatarMin" class="guest" @click="tempSetting.showYzforumUserPanel = true">{{ user.name }}</span>
    </div>

    <div v-if="!user.name" class="login">
      <NuxtLinkLocale to="/login">{{ t('login.title') }}</NuxtLinkLocale>
    </div>

    <LazyYuzuTopBarUserInfo v-if="tempSetting.showYzforumUserPanel"
                            @close="tempSetting.showYzforumUserPanel = false"></LazyYuzuTopBarUserInfo>
  </div>
</template>

<style lang="scss" scoped>
.yzgamer-info {
  display: flex;
  justify-content: center;
  align-items: center;

  .search {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--yzforum-font-color-2);
    font-size: 25px;
    cursor: pointer;
    margin-right: 25px;
  }

  .settings {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--yzforum-font-color-2);
    font-size: 25px;
    cursor: pointer;
  }
}

.avatar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .guest {
    white-space: nowrap;
    cursor: pointer;
    font-size: medium;
    margin-left: 30px;
    color: var(--yzforum-font-color-2);

    &:hover {
      color: var(--yzforum-blue-5);
    }
  }

  .avatar-image {
    margin-left: 30px;
    height: 45px;
    width: 45px;
    cursor: pointer;
    border-radius: 50%;
    position: relative;
  }
}

.login {
  a {
    color: var(--yzforum-blue-5);
  }
}

.status {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.online {
  background-color: var(--yzforum-green-4);
}

.offline {
  background-color: var(--yzforum-blue-5);
}

.new {
  animation: yz-pulse 1s infinite;
  background-color: var(--yzforum-pink-4);
}

.admin {
  animation: yz-pulse 1s infinite;
  background-color: var(--yzforum-red-4);
}

.login {
  margin-left: 30px;
  font-weight: bold;
  white-space: nowrap;
}

@keyframes yz-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 移动端下的设置在汉堡菜单里，顶部栏不需要显示。
@media (max-width: 700px) {
  .settings {
    display: none !important;
  }
}
</style>