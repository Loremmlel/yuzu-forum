<script setup lang="ts">
import type {GameDetail} from "~/types/api/game";

defineProps<{ game: GameDetail }>()

const localePath = useLocalePath()

const gamePRStore = useTempGamePRStore()

const handleRewriteGame = (game: GameDetail) => {
  const {gid, name, markdown, series, alias, official, engine, tags} = game
  gamePRStore.gamePR[0] = {
    gid,
    name,
    introduction: markdown,
    series: series.map((s) => s.toString()),
    alias,
    official,
    engine,
    tags
  }
  navigateTo(localePath(`/edit/game?type=pr&gid=${game.gid}`))
}
</script>

<template>
  <span class="rewrite" @click="handleRewriteGame(game)">
    <Icon class="icon" name="lucide:pencil"></Icon>
  </span>
</template>

<style scoped lang="scss">
.rewrite {
  color: var(--yzforum-font-color-2);
  cursor: pointer;
  display: flex;

  .icon {
    font-size: 24px;
  }
}
</style>