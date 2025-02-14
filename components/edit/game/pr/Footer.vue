<script setup lang="ts">
import type {GameStoreTemp} from "~/store/types/edit/game";
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const gamePRStore = useTempGamePRStore()
const localePath = useLocalePath()

const isPublishing = ref(false)

async function handlePublishGamePR() {
  const gamePR = gamePRStore.gamePR
  const seriesArray = gamePR[0].series
      .toString()
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
  const officialArray = gamePR[0].official
      .toString()
      .split(',')
      .map(o => o.trim())
      .filter(o => o.length > 0)
  const tagsArray = gamePR[0].tags
      .toString()
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
  const pullRequest: GameStoreTemp = {
    gid: gamePR[0].gid,
    name: gamePR[0].name,
    introduction: gamePR[0].introduction,
    series: seriesArray,
    alias: gamePR[0].alias,
    official: officialArray,
    tags: tagsArray
  }
  if (!checkGamePR(pullRequest)) {
    return
  }
  const res = await useComponentMessageStore().alert({
    'en-us': 'Confirm to publish game info update request?',
    'ja-jp': 'ゲームの情報更新リクエストを公開しますか？',
    'zh-cn': '确定发布游戏信息更新请求吗?',
  })
  if (!res) {
    return
  }
  if (isPublishing.value) {
    return
  } else {
    isPublishing.value = true
  }
  const result = await $fetch(`/api/game/${pullRequest.gid}/pr`, {
    method: 'POST',
    body: pullRequest,
    watch: false,
    ...yzforumResponseHandler
  })
  isPublishing.value = false
  if (result) {
    navigateTo(localePath(`/game/${pullRequest.gid}`), {
      replace: true
    })
    useComponentMessageStore().info('AlertInfo.edit.prSuccess')
  }
}

function checkGamePR(game: GameStoreTemp): boolean {
  if (!isValidYzLanguage(game.name, 233)) {
    useMessage(InfoCode.InvalidTitle, 'warn')
    return false
  }
  if (!isValidYzLanguage(game.introduction, 100007)) {
    useMessage(InfoCode.InvalidDescription, 'warn')
    return false
  }
  if (game.alias.length > 17) {
    useMessage(InfoCode.MaxAliasesExceeded, 'warn')
    return false
  }
  for (const alias of game.alias) {
    if (alias.length > 500) {
      useMessage(InfoCode.AliasLengthExceeded, 'warn')
      return false
    }
  }
  if (game.official.length > 17) {
    useMessage(InfoCode.MaxWebsitesExceeded, 'warn')
    return false
  }
  for (const o of game.official) {
    if (o.trim().length > 233) {
      useMessage(InfoCode.WebsiteLengthExceeded, 'warn')
      return false
    }
  }
  if (game.tags.length > 107) {
    useMessage(InfoCode.MaxTagsExceededGame, 'warn')
    return false
  }
  for (const t of game.tags) {
    if (t.length > 107) {
      useMessage(InfoCode.TagNameLengthExceeded, 'warn')
      return false
    }
  }
  if (game.series.length > 50) {
    useMessage(InfoCode.MaxSeriesExceeded, 'warn')
    return false
  }
  for (const s of game.series) {
    if (!/^\d{1,6}$/.test(s)) {
      useMessage(InfoCode.InvalidGameId, 'warn')
      return false
    }
  }
  return true
}
</script>

<template>
  <div class="confirm">
    <YuzuButton @click="handlePublishGamePR">
      {{ t('edit.pr.confirm') }}
    </YuzuButton>
  </div>
</template>

<style scoped lang="scss">
.confirm {
  width: 100%;
  margin-top: 50px;
  display: flex;

  button {
    height: 40px;
    width: 200px;
    font-size: 17px;
    flex-shrink: 0;
    border-radius: 10px;
    margin-left: auto;
  }
}
</style>