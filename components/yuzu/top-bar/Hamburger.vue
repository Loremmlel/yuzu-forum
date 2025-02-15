<script lang="ts" setup>
/** Hamburger菜单项接口定义
 * @prop icon - 显示在菜单项前的图标名称
 * @prop name - 菜单项的唯一标识，用于国际化翻译键
 * @prop router - 导航路径或外部链接
 * @prop hint - 可选提示文本的翻译键
 * @prop external - 标记是否为外部链接
 * */
interface Hamburger {
  icon: string
  name: string
  router: string
  hint?: string
  external?: boolean
}

// 主要导航菜单配置项集合
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
  // {
  //   name: 'about',
  //   icon: 'lucide:info',
  //   router: '/yzforum'
  // },
  // {
  //   name: 'ranking',
  //   icon: 'lucide:align-end-horizontal',
  //   router: '/ranking'
  // },
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

/* 国际化工具和状态管理 */
const {t} = useI18n()
const localePath = useLocalePath()

const tempSetting = useTempSettingStore()

/* 侧边栏滑动控制相关响应式变量
 * startX/Y - 记录触摸起始坐标
 * currentX - 当前横向滑动偏移量
 * isDragging - 拖动状态标志
 * item - 当前显示的菜单项集合（初始显示前6项）
 * */
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const isDragging = ref(false)
const item = ref<Hamburger[]>(hamburgerItems.slice(0, 6))


/** 计算属性：判断是否显示设置面板
 * 当菜单项超过6个时显示设置相关组件
 * */
const showSettings = computed(() => item.value.length > 6)

/** 处理触摸开始事件
 *
 * 记录初始触摸坐标并重置拖动状态
 * @param event - 触摸事件对象
 * */
function handleTouchStart(event: TouchEvent) {
  startX.value = event.touches[0].clientX
  startY.value = event.touches[0].clientY
  currentX.value = 0
  isDragging.value = true
}

/** 处理触摸移动事件
 * 实现垂直滑动优先逻辑：
 * 1. 当垂直滑动距离大于横向时忽略处理
 * 2. 仅处理左滑操作更新currentX值
 * */
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

/** 处理触摸结束事件
 * 根据最终滑动距离决定是否关闭侧边栏：
 * 滑动超过30px时触发关闭操作
 * */
function handleTouchEnd() {
  isDragging.value = false
  const movedX = currentX.value
  if (Math.abs(movedX) > 30) {
    tempSetting.showYzforumHamburger = false
  }
  currentX.value = 0
}

/** 切换显示更多菜单项的展开/收起状态
 * 通过修改item的length实现显示数量切换
 * */
function handleShowMore() {
  if (item.value.length === 6) {
    item.value = hamburgerItems
  } else {
    item.value = hamburgerItems.slice(0, 6)
  }
}
</script>

<template>
  <!-- 侧边栏过渡动画容器
       使用slide过渡效果，持续500ms -->
  <Transition :duration="500" name="slide">
    <!-- 遮罩层容器
        @click 点击遮罩关闭侧边栏 -->
    <div v-if="tempSetting.showYzforumHamburger" class="mask"
         @click="tempSetting.showYzforumHamburger = false" @click.stop>
      <!-- 可滑动内容容器
           @touch 事件绑定滑动处理 -->
      <div class="container" @touchend="handleTouchEnd"
           @click.stop
           @touchstart.passive="handleTouchStart"
           @touchmove.passive="handleTouchMove">
        <!-- 主内容区域 -->
        <div>
          <!-- 论坛品牌标识区
              @click 点击跳转首页 -->
          <div class="yzforum" @click="navigateTo(localePath('/'))">
            <NuxtImg :alt="t('head.title')" src="/favicon.webp"></NuxtImg>
            <span>{{ t('header.name') }}</span>
          </div>
          <!-- 动态菜单项容器
                        根据item数组渲染导航项 -->
          <div class="item-container">
            <!-- 单个菜单项模板
                 包含图标、文字和提示 -->
            <div v-for="(yz, index) in item" :key="index" class="item">
              <span class="icon-item">
                <Icon :name="yz.name" class="icon"></Icon>
              </span>
              <NuxtLinkLocale :target="isValidURL(yz.router) ? '_blank' : ''" :to="yz.router">
                {{ t(`header.hamburger.${yz.name}`) }}
              </NuxtLinkLocale>
              <span v-if="yz.hint" class="hint">{{ t(`header.hamburger.${yz.hint}`) }}</span>
            </div>
          </div>

          <!-- 条件渲染的设置组件集群
              当showSettings为true时显示 -->
          <YuzuSettingPanelMode v-if="showSettings"></YuzuSettingPanelMode>
          <YuzuSettingPanelSwitchLanguage v-if="showSettings"></YuzuSettingPanelSwitchLanguage>
          <YuzuSettingPanelCustomBackground v-if="showSettings" :is-mobile="true"></YuzuSettingPanelCustomBackground>
          <YuzuSettingPanelTransparency v-if="showSettings" style="margin-top: 20px;"></YuzuSettingPanelTransparency>
          <YuzuSettingPanelBlur v-if="showSettings" style="margin-top: 20px;"></YuzuSettingPanelBlur>
          <YuzuSettingPanelFont v-if="showSettings" style="margin-top: 20px;"></YuzuSettingPanelFont>
          <YuzuSettingPanelReset v-if="showSettings" style="margin-top: 20px;"></YuzuSettingPanelReset>

          <!-- 折叠/展开控制按钮
               @click 切换显示更多设置项 -->
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

<style lang="scss" scoped>
/* 遮罩层样式
   全屏固定定位，半透明背景 */
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

/* 侧边栏容器样式
   带毛玻璃效果，右侧圆角 */
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

/* 菜单项容器样式
   带上下边框分隔 */
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
    color: var(--yzforum-blue-5);

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

/* 滑动过渡动画定义 */
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