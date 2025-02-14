<script setup lang="ts">
import type {GameDetail} from "~/types/api/game";

const props = defineProps<{game: GameDetail}>()
provide<GameDetail>('game', props.game)

const {data, status} = await useLazyFetch(`/api/game/${props.game.gid}/contributor`, {
  method: 'GET',
  watch: false,
  ...yzforumResponseHandler
})
</script>

<template>
  <div class="game">
    <GameTitle :game="game"></GameTitle>
    <GameIntroduction :introduction="game.introduction"></GameIntroduction>
    <GameInfo :game="game"></GameInfo>
    <GameResource></GameResource>
    <GameSeries v-if="game.series.length"></GameSeries>
    <GamePrContainer></GamePrContainer>
    <YuzuDivider></YuzuDivider>
    <GameContributor v-if="data" :data="data" :pending="status === 'pending'" :views="game.views"></GameContributor>
    <GameFooter></GameFooter>
    <YuzuDivider></YuzuDivider>
    <GameCommentContainer v-if="data" :user-data="data" :to-user="game.user"></GameCommentContainer>
  </div>
</template>

<style scoped lang="scss">

</style>