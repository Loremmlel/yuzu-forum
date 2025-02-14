<script setup lang="ts">
import type {GameCard} from "~/types/api/game";
import {platformIconMap} from "~/components/game/utils/iconMap";

const {locale, t} = useI18n()

defineProps<{ games: GameCard[] }>()
</script>

<template>
  <div class="grid-card">
    <NuxtLink class="card" v-for="game in games" :key="game.gid" :to="`/game/${game.gid}`">
      <div class="banner">
        <NuxtImg :src="game.banner.replace(/\.webp$/, '-mini.webp')"
                 loading="lazy" :alt="getPreferredLanguageText(game.name, locale as Language)"
                 placeholder="/placeholder.webp"></NuxtImg>
        <div class="platform">
          <template v-if="game.platform.length">
            <span v-for="(platform, index) in game.platform" :key="index">
              <Icon class="icon" :name="platformIconMap[platform]"></Icon>
            </span>
          </template>
          <span v-else class="preparing">
            {{ t('game.preparing') }}
          </span>
        </div>
        <div class="overlay">
          <div class="data">
            <span class="stat">
              <Icon class="icon" name="lucide:mouse-pointer-click"></Icon>
              <span>{{ game.views }}</span>
            </span>

            <span class="stat">
              <Icon class="icon" name="lucide:thumbs-up"></Icon>
              <span>{{ game.likes }}</span>
            </span>
          </div>

          <div class="language">
            <span v-for="(lang, index) in game.language" :key="index">
              {{ lang.slice(0, 2).toUpperCase() }}
            </span>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="title">
          {{ getPreferredLanguageText(game.name, locale as Language) }}
        </div>

        <div class="publisher">
          <YuzuAvatar :user="game.user" size="30px"></YuzuAvatar>
          <div class="info">
            <span class="name">{{ game.user.name }}</span>
            <span class="time">{{ formatTimeDiff(game.time, locale as Language) }}</span>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.grid-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  color: var(--yzforum-font-color-3);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  @include yz-blur;
}

.banner {
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    max-width: 100%;
    transition: transform 0.5s ease;
  }

  .platform {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 1;
    color: var(--yzforum-font-color-0);
    background-color: var(--yzforum-trans-white-5);
    border-radius: 10px;
    padding: 5px 10px;
    @include yz-center;

    span {
      display: flex;
      margin-right: 3px;

      &:last-child {
        margin-right: 0;
      }
    }

    .preparing {
      color: var(--yzforum-pink-4);
      font-weight: bold;
      font-size: small;
    }
  }

  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px 8px;
    background: linear-gradient(transparent, var(--yzforum-mask-color-0));
    color: var(--yzforum-white-solid);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: small;

    .data {
      display: flex;
      gap: 8px;

      .stat {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }

    .language {
      display: flex;
      gap: 8px;

      span {
        padding: 2px 4px;
        background: var(rgba(255, 255, 255, 0.2));
        border-radius: 4px;
      }
    }
  }
}

.card:hover .banner img {
  transform: scale(1.1);
}

.card-content {
  padding: 10px;
}

.title {
  color: var(--yzforum-blue-5);
  font-weight: bold;
  margin: 7px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.publisher {
  display: flex;
  align-items: center;

  .info {
    display: flex;
    flex-direction: column;

    .name {
      margin: 0 10px;
      font-size: small;
    }

    .time {
      color: var(--yzforum-font-color-0);
      font-size: small;
      margin: 0 7px;
    }
  }
}

@media (max-width: 700px) {
  .grid-card {
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    gap: 5px;
  }
}
</style>