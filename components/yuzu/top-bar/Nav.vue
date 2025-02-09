<script setup lang="ts">
import {ReturnMessage} from "~/code&message/returnMessage";

const {t} = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const getRouteBaseName = useRouteBaseName()
const baseRouteName = computed(() => {
  return getRouteBaseName(route)
})

const {showYzforumHamburger, messageStatus} = storeToRefs(useTempSettingStore())
watch(
    () => baseRouteName.value,
    () => {
      useTempSettingStore().reset()
    }
)

onMounted(async () => {
  const result = await $fetch('/api/message/unread', {
    method: 'GET'
  })
  if (result === ReturnMessage.Online) {
    messageStatus.value = 'online'
  } else {
    messageStatus.value = 'new'
  }
})

function handleRouterBack() {
  if (window.history.state.back) {
    router.back()
  } else {
    navigateTo(localePath('/'))
  }
}
</script>

<template>
  <!--顶部栏左半边部分导航栏，有网站图片、名称，以及游戏、讨论等的导航-->
  <div class="nav-top">
    <div class="return" v-if="baseRouteName !== 'index'" @click="handleRouterBack">
      <Icon class="icon" name="lucide:arrow-left"></Icon>
    </div>
    <!--汉堡菜单。展示在左侧，纵向排列。用于移动端。-->
    <div class="hamburger">
      <Icon class="icon" name="lucide:menu" @click="showYzforumHamburger = true"></Icon>
      <LazyYuzuTopBarHamburger></LazyYuzuTopBarHamburger>
    </div>
    <div class="yzforum">
      <NuxtLinkLocale to="/">
        <NuxtImg src="/favicon.webp" alt="Yzforum | 柚子游戏"></NuxtImg>
        <span>{{ t('header.name') }}</span>
      </NuxtLinkLocale>
    </div>
    <YuzuTopBarNavBar></YuzuTopBarNavBar>
  </div>
</template>

<style scoped lang="scss">
.return, .hamburger {
  display: none;
  cursor: pointer;

  .icon {
    font-size: 20px;
  }
}

.return {
  margin-right: 16px;
}

.nav-top {
  display: flex;
  align-items: center;
  height: 100%;
}

.yzforum {
  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: var(--yzforum-font-color-3);

    img {
      width: 50px;
      height: 50px;
      margin-right: 30px;
    }
  }
}

@media (max-width: 1000px) {
  .yzforum {
    display: none;
    span {
      display: none;
    }
    img {
      margin-right: 0 !important;
    }
  }
  .return, .hamburger {
    display: block;
  }
}
</style>