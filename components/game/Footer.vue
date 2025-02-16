<script lang="ts" setup>
import type {GameDetail} from "~/types/api/game";

const {t} = useI18n()

const showHistory = ref(false)
const game = inject<GameDetail>('game')
</script>

<template>
  <div v-if="game" class="footer">
    <span class="history" @click="showHistory = !showHistory">
      {{ t('game.history.name') }}
    </span>
    <div class="operation">
      <span class="hint">
        {{ t('game.history.operation') }}
      </span>
      <GameLike v-tooltip="{
                  message: {
                    'en-us': 'Like',
                    'ja-jp': 'いいね',
                    'zh-cn': '点赞',
                  },
                  position: 'bottom'
                }" :gid="game.gid" :is-liked="game.likes.isLiked"
                :likes-count="game.likes.count" :to-uid="game.user.uid"></GameLike>

      <GameFavorite v-tooltip="{
                      message: {
                        'en-us': 'Favorite',
                        'ja-jp': 'お気に入り',
                        'zh-cn': '收藏'
                      },
                      position: 'bottom'
                    }" :favorites-count="game.favorites.count" :gid="game.gid"
                    :is-favorite="game.favorites.isFavorite" :to-uid="game.user.uid"></GameFavorite>

      <GameRewrite v-tooltip="{
          message: 'Rewrite',
          position: 'bottom'
        }" :game="game"></GameRewrite>
    </div>
  </div>

  <LazyGameHistory v-if="showHistory"></LazyGameHistory>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .history {
    cursor: pointer;
    font-style: oblique;
    color: var(--yzforum-blue-5);
  }

  .favorite {
    margin: 0 20px;
  }
}

.operation {
  position: relative;
  margin-right: 20px;
  display: flex;

  .hint {
    user-select: none;
    white-space: nowrap;
    position: absolute;
    font-size: small;
    top: 40px;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--yzforum-font-color-0);
  }
}
</style>