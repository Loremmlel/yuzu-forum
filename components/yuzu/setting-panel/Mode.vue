<script lang="ts" setup>
import {usePersistSettingsStore} from "#imports";

interface Mode {
  name: string
  icon: string
}

const modeItem: Mode[] = [
  {
    name: 'light',
    icon: 'line-md:moon-filled-alt-to-sunny-filled-loop-transition'
  },
  {
    name: 'dark',
    icon: 'line-md:sunny-outline-to-moon-loop-transition'
  },
  {
    name: 'system',
    icon: 'line-md:light-dark-loop'
  }
]

const {t} = useI18n()

const colorMode = useColorMode()
const setting = usePersistSettingsStore()

watch(
    () => colorMode.value,
    () => {
      setting.setYzforumTransparency(
          setting.showYzforumPageTransparency,
          colorMode.value as 'dark' | 'light'
      )
    }
)
</script>

<template>
  <!--日夜模式切换-->
  <div class="mode">
    <span>{{ t('header.settings.mode') }}</span>
    <div class="mode-container">
      <span v-for="(mode, index) in modeItem" :key="index"
            :class="colorMode.preference === mode.name ? 'active' : ''">
        <Icon :name="mode.icon" class="icon" @click="colorMode.preference = mode.name"></Icon>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mode {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mode-container {
  width: 60%;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  & > span {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-bottom: 3px;

    &:nth-child(1) {
      color: var(--yzforum-red-4)
    }

    &:nth-child(2) {
      color: var(--yzforum-blue-5)
    }

    &:nth-child(3) {
      color: var(--yzforum-purple-4)
    }
  }
}

.active {
  border-bottom: 2px solid var(--yzforum-blue-2);
}
</style>