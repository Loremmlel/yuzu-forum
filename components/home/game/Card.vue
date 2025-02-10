<script setup lang="ts">
import type {HomeGame} from "~/types/api/home";
import {platformIconMap} from "~/components/game/utils/platformIconMap";

const {locale} = useI18n()

const props = defineProps<{game: HomeGame}>()
</script>

<template>
  <NuxtLinkLocale class="game" :to="`/game/${props.game.gid}`" v-yuzu-gradient>
    <div class="title">
      <span>{{getPreferredLanguageText(props.game.name, locale as Language)}}</span>
      <span class="time">{{formatTimeDiff(props.game.time, locale as Language)}}</span>
    </div>

    <div class="info">
      <div class="contributors">
        <YuzuAvatar v-for="(user, index) in props.game.contributors" :key="index" :user="user" size="30px"></YuzuAvatar>
        <span class="views">
          <span><Icon class="icon" name="lucide:mouse-pointer-click"></Icon></span>
          <span>{{props.game.views}}</span>
        </span>
      </div>

      <div class="status">
        <div class="platform">
          <span v-for="(platform, index) in props.game.platforms" :key="index">
            <Icon class="icon" :name="platformIconMap[platform]"></Icon>
          </span>
        </div>

        <div class="language">
          <span v-for="(language, index) in props.game.languages" :key="index">
            {{language.slice(0, 2).toUpperCase()}}
          </span>
        </div>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<style scoped lang="scss">
.game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--yzforum-font-color-3);
  padding: 10px 10px 0;
  border-radius: 10px;
}

.title {
  width: 100%;
  font-size: 18px;
  margin-bottom: 8px;

  .time {
    color: var(--yzforum-font-color-0);
    font-size: small;
    font-weight: initial;
    margin-left: 18px;
    white-space: nowrap;
  }
}

.info {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 10px;
  font-size: small;

  .contributors {
    display: flex;
    align-items: center;

    img {
      border-radius: 50%;
      overflow: hidden;
      display: inline-block;
    }

    .views {
      @include yz-center;
      margin: 0 10px;
      user-select: none;

      span {
        display: flex;
        margin-right: 3px;
      }
    }
  }
}
</style>