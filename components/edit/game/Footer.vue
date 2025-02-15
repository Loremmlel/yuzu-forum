<script setup lang="ts">
import {InfoCode} from "~/code&message/infoCode";

const {t, locale} = useI18n()

const editGameStore = usePersistEditGameStore()

const localePath = useLocalePath()
const isPublishing = ref(false)

async function handlePublishGame() {
  const banner = await getImage('yzforum-publish-banner')
  if (!checkGamePublish(editGameStore.name, banner, editGameStore.introduction)) {
    return
  }
  const res = await useComponentMessageStore().alert({
    'en-us': 'Confirm to Publish Game?',
    'ja-jp': 'ゲームを公開しますか？',
    'zh-cn': '确定发布游戏吗?'
  }, {
    'en-us': 'You are about to publish a game. After publishing, you must go to the resource details page of the game you published and add a link for obtaining/downloading that game resource.',
    'ja-jp': 'あなたはゲームを公開しようとしています。公開後は、公開したゲームのリソース詳細ページに移動し、そのゲームリソースの取得/ダウンロードリンクを追加する必要があります。',
    'zh-cn': '您要发布的是游戏。发布后, 您必须到您发布完成的游戏资源详情页, 添加一条该游戏资源的获取 / 下载链接。'
  })
  if (!res) {
    return
  }
  if (isPublishing.value) {
    return
  } else {
    isPublishing.value = true
    useMessage(InfoCode.GamePublishing, 'info', 8000)
  }

  const formData = new FormData()
  formData.append('vndbId', 'yuzu!')
  formData.append('name', JSON.stringify(editGameStore.name))
  formData.append('banner', banner!)
  formData.append('introduction', JSON.stringify(editGameStore.introduction))
  formData.append('aliases', JSON.stringify(getPreferredLanguageText(editGameStore.name, locale.value).slice(0, 17)))

  const gid = await $fetch('/api/game', {
    method: 'POST',
    body: formData,
    watch: false,
    ...yzforumResponseHandler
  })
  isPublishing.value = false
  if (gid) {
    await deleteImage('yzforum-publish-banner')
    editGameStore.reset()
    navigateTo(localePath(`/game/${gid}`))
    useComponentMessageStore().info('AlertInfo.edit.publishSuccess')
  }
}

function checkGamePublish(name: YuzuLanguage, banner: Blob | null, introduction: YuzuLanguage): boolean {
  if (!isValidYzLanguage(name, 233)) {
    useMessage(InfoCode.TitleRequirements, 'warn')
    return false
  }
  if (!banner) {
    useMessage(InfoCode.PreviewImageRequired, 'warn')
    return false
  }
  if (banner.size > 1007 * 1024) {
    useMessage(InfoCode.PreviewSizeExceeded, 'warn')
    return false
  }
  if (!isValidYzLanguage(introduction, 100000)) {
    useMessage(InfoCode.DescriptionRequirements, 'warn')
    return false
  }
  return true
}
</script>

<template>
  <div class="confirm">
    <YuzuButton @click="handlePublishGame">
      {{ t('edit.game.confirm') }}
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
    font-size: 18px;
    flex-shrink: 0;
    border-radius: 10px;
    margin-left: auto;
  }
}
</style>