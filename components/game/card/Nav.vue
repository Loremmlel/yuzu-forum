<script lang="ts" setup>
import {useTempGameStore} from "~/store/temp/game/game";
import {
  type LanguageOptions,
  languageOptions,
  type PlatformOptions,
  platformOptions,
  type TypeOptions,
  typeOptions
} from "~/components/game/utils/option";

const {t} = useI18n()

const tempGameStore = useTempGameStore()

watch(
    () => [
      tempGameStore.type,
      tempGameStore.language,
      tempGameStore.platform,
      tempGameStore.sortOrder,
      tempGameStore.sortField
    ],
    () => {
      tempGameStore.page = 1
    }
)
</script>

<template>
  <div class="nav">
    <YuzuSelect :options="typeOptions" :styles="{width: '150px'}" i18n="game.resource.type"
                position="bottom" @set="(newVal) => tempGameStore.type = newVal as TypeOptions">
      {{ t(`game.resource.type.${tempGameStore.type}`) }}
    </YuzuSelect>

    <YuzuSelect :options="languageOptions" :styles="{width: '150px'}" i18n="game.resource.language"
                position="bottom" @set="(newVal) => tempGameStore.language = newVal as LanguageOptions">
      {{ t(`game.resource.language.${tempGameStore.language}`) }}
    </YuzuSelect>

    <YuzuSelect :options="platformOptions" :styles="{width: '150px'}" i18n="game.resource.platform"
                position="bottom" @set="(newVal) => tempGameStore.platform = newVal as PlatformOptions">
      {{ t(`game.resource.platform.${tempGameStore.platform}`) }}
    </YuzuSelect>

    <YuzuSelect :options="['time', 'created', 'views']" :styles="{width: '150px'}" i18n="game.resource.sort"
                position="bottom" @set="(newVal) => tempGameStore.sortField = newVal as 'time' | 'views'">
      {{ t(`game.resource.sort.${tempGameStore.sortField}`) }}
    </YuzuSelect>

    <div class="order">
      <span :class="tempGameStore.sortOrder === 'asc' ? 'active' : ''" @click="tempGameStore.sortOrder = 'asc'">
        <Icon class="icon" name="lucide:arrow-up"></Icon>
      </span>
      <span :class="tempGameStore.sortOrder === 'desc' ? 'active' : ''" @click="tempGameStore.sortOrder = 'desc'">
        <Icon class="icon" name="lucide:arrow-down"></Icon>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--yzforum-trans-white-5);
  border-radius: 10px;
  box-shadow: var(--shadow);
  margin-bottom: 10px;
  z-index: 10;
  position: relative;
  max-width: 100%;
  padding: 10px 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    border-radius: 10px;
    backdrop-filter: blur(var(--yz-background-blur));
    will-change: transform;
  }
}

.order {
  display: flex;
  margin-left: auto;

  .icon {
    font-size: 20px;
  }

  & > span {
    display: flex;
    cursor: pointer;
    padding: 3px 10px;
    margin-right: 5px;
    border-radius: 10px;
  }

  .active {
    box-shadow: var(--shadow);
    color: var(--yzforum-blue-5);
  }
}

@media (max-width: 700px) {
  .nav {
    padding: 10px 5px;
    margin: 0 5px 5px;
  }
}
</style>