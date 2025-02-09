<script setup lang="ts">
interface Hamburger {
  icon: string
  name: string
  router: string
  hint?: string
  external?: boolean
}

const hamburgerItems: Hamburger[] = [
  {
    name: 'game',
    icon: 'lucide:gamepad-2',
    router: '/game'
  },
  {
    name: 'pool',
    icon: 'lucide:square-library',
    router: '/pool'
  },
  {
    name: 'category',
    icon: 'lucide:layers-3',
    router: '/category'
  },
  {
    name: 'createTopic',
    icon: 'lucide:pencil',
    router: '/edit/topic'
  },
  {
    name: 'createGame',
    icon: 'lucide:wand',
    router: '/edit/Game?type=publish',
    hint: 'createHint'
  },
  {
    name: 'about',
    icon: 'lucide:info',
    router: '/yzforum'
  },
  {
    name: 'ranking',
    icon: 'lucide:align-end-horizontal',
    router: '/ranking'
  },
  {
    name: 'update',
    icon: 'lucide:arrow-big-up-dash',
    router: '/update-log'
  },
  {
    name: 'banned',
    icon: 'lucide:ban',
    router: '/banned'
  }
]


const {t} = useI18n()
const localePath = useLocalePath()

const tempSetting = useTempSettingStore()
const persistSetting = usePersistUserStore()

const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const isDragging = ref(false)
const item = ref<Hamburger[]>(hamburgerItems.slice(0, 6))
const showSettings = computed(() => item.value.length > 6)

function handleTouchStart(event: TouchEvent) {
  startX.value = event.touches[0].clientX
  startY.value = event.touches[0].clientY
  currentX.value = 0
  isDragging.value = true
}

function handleTouchMove(event: TouchEvent) {
  const touchX = event.touches[0].clientX
  const touchY = event.touches[0].clientY
  const deltaX = touchX - startX.value
  const deltaY = touchY - startY.value
  if (deltaY < deltaX) {
    return
  }

  if (deltaX < 0) {
    requestAnimationFrame(() => {
      currentX.value = deltaX
    })
  }
}

function handleTouchEnd() {
  isDragging.value = false
  const movedX = currentX.value
  if (Math.abs(movedX) > 30) {
    tempSetting.showYzforumHamburger = false
  }
  currentX.value = 0
}

function handleShowMore() {
  if (item.value.length === 6) {
    item.value = hamburgerItems
  } else {
    item.value = hamburgerItems.slice(0, 6)
  }
}
</script>

<template>
  <Transition :duration="500" name="slide">
    <div v-if="tempSetting.showYzforumHamburger" class="mask"
         @click.stop @click="tempSetting.showYzforumHamburger = false">
      <div class="container" @click.stop
           @touchstart.passive="handleTouchStart"
           @touchmove.passive="handleTouchMove"
           @touchend="handleTouchEnd">
        <div>
          <div class="yzforum" @click="navigateTo(localePath('/'))">
            <NuxtImg src="/favicon.webp" :alt="t('head.title')"></NuxtImg>
            <span>{{ t('header.name') }}</span>
          </div>

          <div class="item-container">
            <div v-for="(yz, index) in item" :key="index" class="item">
              <span class="icon-item">
                <Icon class="icon" :name="yz.name"></Icon>
              </span>
              <NuxtLinkLocale :to="yz.router" :target="isValidURL(yz.router) ? '_blank' : ''">
                {{ t(`header.hamburger.${yz.name}`) }}
              </NuxtLinkLocale>
              <span class="hint" v-if="yz.hint">{{ t(`header.hamburger.${yz.hint}`) }}</span>
            </div>
          </div>

          <YuzuSettingPanelMode v-if="showSettings"></YuzuSettingPanelMode>
          <YuzuSettingPanelSwitchLanguage v-if="showSettings"></YuzuSettingPanelSwitchLanguage>
          <YuzuSettingPanelCustomBackground v-if="showSettings" :is-mobile="true"></YuzuSettingPanelCustomBackground>
          <YuzuSettingPanelTransparency v-if="showSettings" style="margin-top: 20px;"></YuzuSettingPanelTransparency>
          <YuzuSettingPanelBlur v-if="showSettings" style="margin-top: 20px;"></YuzuSettingPanelBlur>
          <YuzuSettingPanelFont v-if="showSettings" style="margin-top: 20px;"></YuzuSettingPanelFont>
          <YuzuSettingPanelReset v-if="showSettings" style="margin-top: 20px;"></YuzuSettingPanelReset>

          <span class="more" @click="handleShowMore">
            <span>{{ t('header.hamburger.settings') }}</span>
            <span :class="showSettings ? 'active' : ''">
              <Icon class="icon" name="lucide:chevron-down"></Icon>
            </span>
          </span>
        </div>

        <div class="links">
          <a
              aria-label="Yuzu Game Forum Open Source GitHub Repository | 柚子游戏论坛开源GitHub仓库"
              href="https://github.com/Loremmlel/yuzu-forum"
              target="_blank">
            <span><Icon class="icon" name="lucide:github"></Icon></span>
            <span>GitHub</span>
          </a>

          <NuxtLinkLocale to="/rss">
            <span><Icon class="icon" name="lucide:rss"></Icon></span>
            <span>RSS</span>
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.mask {
  height: 100dvh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  color: var(--yzforum-font-color-3);
  background-color: var(--yzforum-font-color-0);
  transition: opacity 0.3s;
  z-index: 1;
  overflow: hidden;
}

.container {
  height: 100%;
  position: absolute;
  width: 250px;
  overflow-y: scroll;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @include yz-blur;
  border-radius: 0 5px 5px 0;
}

.item-container {
  border-top: 1px solid var(--yzforum-trans-blue-4);
  border-bottom: 1px solid var(--yzforum-trans-blue-4);
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.item {
  display: flex;
  align-items: center;
  padding: 10px 0;

  &:first-child {
    padding-top: 20px;
  }

  &:last-child {
    padding-bottom: 20px;
  }

  .icon-item {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: var(--yzforum-blue-5);
    margin-right: 15px;
  }

  a {
    color: var(--yzforum-font-color-3);
  }

  .hint {
    color: var(--yzforum-red-2);
    margin-left: 20px;
    font-size: small;
  }
}

.more {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;

  span {
    display: flex;

    &:first-child {
      font-size: small;
      margin-right: 10px;
      color: var(--yzforum-font-color-1)
    }
  }
}

.links {
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 20px;
  margin: 20px 0;

  & > a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--kungalgame-blue-5);

    & > span {
      &:first-child {
        cursor: pointer;
      }

      &:last-child {
        font-size: x-small;
      }
    }
  }
}

.active {
  transform: rotate(180deg);
  transition: transform 0.2s;
}

.yzforum {
  display: flex;
  align-items: center;

  img {
    height: 40px;
    margin-right: 10px;
  }

  span {
    font-size: 20px;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-leave-active {
  transition-delay: 0.25s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-active .container,
.slide-leave-active .container {
  transition: all 0.3s ease-in-out;
}

.slide-enter-from .container,
.slide-leave-to .container {
  transform: translateX(-100%);
  opacity: 0;
}
</style>