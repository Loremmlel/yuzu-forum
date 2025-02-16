<script lang="ts" setup>
import type {GameDetail} from "~/types/api/game";
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{ game: GameDetail }>()

const userStore = usePersistUserStore()

const {locale, t} = useI18n()

const route = useRoute()

const initialImageUrl = ref('')
const showUpload = ref(false)

const gid = ref(route.params.gid as string)

const hasPermission = computed(() => props.game.user.uid === userStore.uid || userStore.roles >= 2)

async function handleChangeBanner() {
  const imageBlob = await getImage('yzforum-rewrite-banner')
  if (!imageBlob) {
    useMessage(InfoCode.UploadImageFirst, 'warn')
    return
  }

  const res = await useComponentMessageStore().alert(
      {
        'en-us': 'Confirm to update banner?',
        'ja-jp': 'バナーを更新しますか？',
        'zh-cn': '确定更新预览图吗?'
      },
      {
        'en-us': 'Due to network caching, your new image may take some time to take effect. You can use Ctrl + F5 to refresh the page cache',
        'ja-jp': 'ネットワークキャッシュのため、新しい画像が反映されるまでに時間がかかる場合があります。ページキャッシュを更新するには、Ctrl + F5 を使用してください。',
        'zh-cn': '由于网络缓存, 您的新图片可能需要一段时间才会生效, 可以使用 Ctrl + F5 刷新页面缓存。'
      }
  )
  if (!res) {
    return
  }
  const formData = new FormData()
  formData.append('avatar', imageBlob)
  useMessage(InfoCode.PreviewUploading, 'info')
  const result = await $fetch(`/api/game/${gid.value}/banner`, {
    method: 'PUT',
    body: formData,
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    showUpload.value = false
    initialImageUrl.value = ''
    await deleteImage('yzforum-rewrite-banner')
    useMessage(InfoCode.PreviewUploadSuccess, 'success')
  }
}

onMounted(async () => {
  const imageBlob = await getImage('yzforum-rewrite-banner')
  if (imageBlob) {
    initialImageUrl.value = URL.createObjectURL(imageBlob)
  }
})
</script>

<template>
  <YuzuHeader :size="1">
    <template #header>
      {{ getPreferredLanguageText(game.name, locale as Language) }}
    </template>
  </YuzuHeader>
  <div class="banner">
    <NuxtImg :src="game.banner" loading="lazy"></NuxtImg>

    <div v-if="showUpload && hasPermission" class="upload">
      <span class="close" @click="showUpload = false">
        <Icon class="icon" name="lucide:x"></Icon>
      </span>
      <YuzuUpload :aspect="16/9" :initial-image="initialImageUrl" :placeholder="t('game.banner.hint')" :size="1920"
                  width="300px"
                  @set-image="(img) => saveImage(img, 'yzforum-rewrite-banner')"></YuzuUpload>
      <span class="confirm" @click="handleChangeBanner">
        {{ t('game.banner.confirm') }}
      </span>
    </div>
    <span v-if="hasPermission" class="change" @click="showUpload = !showUpload">
      {{ t('game.banner.change') }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.banner {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  position: relative;
  color: var(--yzforum-font-color-0);
  user-select: none;

  img {
    max-width: 100%;
    margin: 0 auto;
  }

  .upload {
    position: absolute;
    bottom: 0;
    right: 0;

    @include yz-blur;

    .close {
      position: absolute;
      top: 3px;
      right: 10px;
      font-size: 24px;
      cursor: pointer;
    }

    .confirm {
      position: absolute;
      bottom: 3px;
      left: 10px;
      font-size: small;
      cursor: pointer;
    }
  }
}

.change {
  position: absolute;
  bottom: 3px;
  right: 10px;
  cursor: pointer;
  font-size: small;
}
</style>