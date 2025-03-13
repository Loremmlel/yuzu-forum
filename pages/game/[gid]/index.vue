<script lang="ts" setup>
import type {GameDetail} from "~/types/api/game";

const {locale, t} = useI18n()
const route = useRoute()

const game = ref<GameDetail>()
const isBanned = ref(false)
const gid = ref(route.params.gid as string)

const {data} = await useFetch(`/api/game/${gid.value}`, {
  method: 'GET',
  watch: false,
  key: 'game',
  ...yzforumResponseHandler
})

if (data.value === 'banned') {
  isBanned.value = true
} else if (typeof data.value !== 'string') {
  game.value = data.value ?? undefined
}

if (game.value) {
  const titleBase = getPreferredLanguageText(game.value.name, locale.value as Language)
  const title = titleBase.concat(titleBase !== game.value.name['ja-jp'] && game.value.name['ja-jp']
      ? ` | ${game.value.name['ja-jp']}` : '').concat(` - 柚子游戏`)
  const description = markdownToText(getPreferredLanguageText(game.value.introduction, locale.value as Language))
  const keywords = Object.values(game.value.name).join(', ') + ', ' + game.value.alias.toString()

  useHead({
    title,
    htmlAttrs: {
      lang: locale.value
    },
    meta: [
      {
        name: 'description',
        content: description
      },
      {
        name: 'keywords',
        content: keywords
      },
      {
        name: 'og:title',
        content: title
      },
      {
        name: 'og:description',
        content: description
      },
      {
        property: 'og:image',
        content: game.value.banner
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:url',
        content: useRequestURL().href
      }
    ]
  })
}
</script>

<template>
  <div class="root">
    <Game v-if="game" :game="game"></Game>

    <YuzuNull :condition="!game && !isBanned" type="404"></YuzuNull>

    <YuzuBlank v-if="isBanned">
      {{ t('game.banned') }}
    </YuzuBlank>
  </div>
</template>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 20px;

  @include yz-blur;
}
</style>