<script setup lang="ts">
import {usePersistSettingsStore} from "#imports";

const {t} = useI18n()
const localePath = useLocalePath()

const setting = usePersistSettingsStore()

const showItemIndex = ref(1)

const emits = defineEmits<{close: [showYzforumPanel: boolean]}>()

function handleCloseSettingPanel() {
  emits('close', false)
}
</script>

<template>
  <div class="root">
    <div class="container">
      <div class="title">
        <span>{{t('header.settings.name')}}</span>
        <span>
          <Icon @click="navigateTo(localePath('/rss'))" class="rss-icon" name="lucide:rss"></Icon>
          <Icon class="setting-icon" name="uiw:setting-o"></Icon>
        </span>
      </div>

      <YuzuSettingPanelMode></YuzuSettingPanelMode>
      <YuzuSettingPanelSwitchLanguage></YuzuSettingPanelSwitchLanguage>

      <div class="switch">
        <div class="menu">
          <span :class="showItemIndex === 1 ? 'active' : ''" @click="showItemIndex = 1">
            <Icon class="icon" name="mdi:circle-transparent"></Icon>
          </span>
          <span :class="showItemIndex === 2 ? 'active' : ''" @click="showItemIndex = 2">
            <Icon class="icon" name="tabler:blur"></Icon>
          </span>
          <span :class="showItemIndex === 3 ? 'active' : ''" @click="showItemIndex = 3">
            <Icon class="icon" name="ci:font"></Icon>
          </span>

          <span class="loli" v-tooltip="{
            message: {
              'en-us': 'Whether to display Kohaku',
                'ja-jp': '琥珀を表示しますか？',
                'zh-cn': '是否显示琥珀'
            },
            position: 'bottom'
          }">
            <YuzuSwitch v-model="setting.showYzforumBackLoli"></YuzuSwitch>
          </span>
        </div>

        <TransitionGroup name="item" tag="div">
          <div class="item" v-if="showItemIndex === 1">
            <YuzuSettingPanelTransparency></YuzuSettingPanelTransparency>
          </div>
          <div class="item" v-if="showItemIndex === 2">
            <YuzuSettingPanelBlur></YuzuSettingPanelBlur>
          </div>
          <div class="item" v-if="showItemIndex === 3">
            <YuzuSettingPanelFont></YuzuSettingPanelFont>
          </div>
        </TransitionGroup>
      </div>
      <YuzuSettingPanelBackground class="background"></YuzuSettingPanelBackground>
      <YuzuSettingPanelReset></YuzuSettingPanelReset>
    </div>
    <div class="close">
      <Icon class="icon" name="lucide:x" @click="handleCloseSettingPanel"></Icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.root {
  top: 75px;
  right: 0;
  position: absolute;
  display: flex;
  border: 1px solid var(--yzforum-blue-2);

  @include yz-blur;
  backdrop-filter: blur(10px);
}

.container {
  position: relative;
  margin: 20px;
  font-size: 20px;
}

@keyframes settings {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.title {
  font-size: 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    display: flex;
    align-items: center;
  }

  .rss-icon {
    cursor: pointer;
    margin-right: 20px;
  }

  .setting-icon {
    animation: settings 3s linear infinite;
  }
}

.switch {
  display: flex;
  flex-direction: column;

  .menu {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    span {
      cursor: pointer;
      border-radius: 10px;
      padding: 5px 8px;
      font-size: 20px;

      @include yz-center;
    }

    .active {
      box-shadow: var(--shadow);
      background-color: var(--yzforum-trans-blue-0);
      color: var(--yzforum-blue-5)
    }
  }

  .item {
    width: 100%;
    height: 75px;
  }
}

.close {
  font-size: 25px;
  width: 60px;
  display: flex;
  justify-content: flex-end;
  margin: 20px;
  cursor: pointer;
}

.item-move,
.item-enter-active,
.item-leave-active {
  transition: all 0.5s ease;
}

.item-enter-from,
.item-leave-to {
  opacity: 0;
  transform: translateY(80px);
}

.item-leave-active {
  position: absolute;
}

// 移动端不显示该设置界面。在hamburger里。
@media (max-width: 1000px) {
  .root {
    display: none;
  }
}
</style>