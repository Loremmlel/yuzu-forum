<script lang="ts" setup>
import type {GameDetail} from "~/types/api/game";
import {platformIconMap} from "~/components/game/utils/iconMap";

const {t} = useI18n()

defineProps<{ game: GameDetail }>()
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{ t('game.info.name') }}
    </template>
  </YuzuHeader>

  <div class="name">
    <h4>{{ t('game.info.title') }}</h4>
    <YuzuCopy v-if="game.name['en-us']" :text="game.name['en-us']"></YuzuCopy>
    <YuzuCopy v-if="game.name['ja-jp']" :text="game.name['ja-jp']"></YuzuCopy>
    <YuzuCopy v-if="game.name['zh-cn']" :text="game.name['zh-cn']"></YuzuCopy>
  </div>

  <div>
    <h4>{{ t('game.info.tags') }}</h4>
    <GameNull v-if="!game.tags.length"></GameNull>
    <TopicTags :show-icon="false" :tags="game.tags"></TopicTags>
  </div>

  <div>
    <h4>{{ t('game.info.alias') }}</h4>
    <GameNull v-if="!game.alias.length"></GameNull>
    <TopicTags :show-icon="false" :tags="game.alias"></TopicTags>
  </div>

  <div class="official">
    <h4>{{ t('game.info.official') }}</h4>
    <GameNull v-if="!game.official.length"></GameNull>
    <template v-else>
      <span v-for="(off, index) in game.official" :key="index" class="link">
        <YuzuCopy :text="off"></YuzuCopy>
        <a :href="off" rel="noopener noreferer" target="_blank">
          <Icon class="icon" name="lucide:external-link"></Icon>
        </a>
      </span>
    </template>
  </div>

  <div class="platform">
    <h4>{{ t('game.info.platform') }}</h4>
    <span v-for="(platform, index) in game.platform" :key="index" v-tooltip="{
      message: t(`game.resource.platform.${platform}`),
      position: 'bottom'
    }">
      <Icon :name="platformIconMap[platform]" class="icon"></Icon>
    </span>
  </div>

  <div class="index">
    <h4>{{ t('game.info.index') }}</h4>
    <span>{{ game.gid }}</span>
  </div>
</template>

<style lang="scss" scoped>
div {
  margin-bottom: 20px;
}

h4 {
  margin-right: 20px;
}

.name {
  .yuzu-copy {
    font-size: large;
  }
}

.official {
  .link {
    cursor: pointer;
    margin-bottom: 10px;
    margin-right: 20px;
    display: inline-block;

    & > a {
      margin-left: 10px;
      font-size: 20px;
      color: var(--yzforum-font-color-0);

      &:hover {
        color: var(--yzforum-blue-5);
      }
    }
  }
}

.platform {
  display: flex;

  span {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: var(--yzforum-font-color-2);
    margin-right: 10px;
  }
}

.index {
  display: flex;
}
</style>