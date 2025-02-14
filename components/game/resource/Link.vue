<script setup lang="ts">
import type {GameResource, GameResourceDetails} from "~/types/api/gameResource";
import {InfoCode} from "~/code&message/infoCode";
import {platformIconMap, typeIconMap} from "~/components/game/utils/iconMap";

const {t} = useI18n()

const props = defineProps<{ link: GameResource, refresh: () => Promise<unknown> }>()

const details = ref<GameResourceDetails>()
const userStore = usePersistUserStore()
const gameResourceStore = useTempGameResourceStore()
const isFetching = ref(false)

async function handleGetDetail(grid: number) {
  if (details.value) {
    return
  }
  isFetching.value = true
  const result = await $fetch(`/api/game/${props.link.gid}/resource`, {
    method: 'GET',
    query: {grid},
    ...yzforumResponseHandler
  })
  isFetching.value = false

  if (result) {
    details.value = result
  }
}

async function handleMarkValid(gid: number, grid: number) {
  const res = await useComponentMessageStore().alert(
      {
        'en-us': 'Are you sure you want to re-mark the resource link as valid?',
        'ja-jp': 'リソースリンクを有効として再マークしますか？',
        'zh-cn': '您确定重新标记资源链接有效吗？'
      },
      {
        'en-us': 'If you have fixed the resource links, you can re-mark the resource links as valid.',
        'ja-jp': 'リソースリンクを修正した場合、リンクを有効として再マークできます。',
        'zh-cn': '若您修复了资源链接，您可以重新标记资源链接有效。'
      })
  if (!res) {
    return
  }
  const result = await $fetch(`/api/game/${gid}/resource/valid`, {
    method: 'PUT',
    query: {grid},
    watch: false,
    ...yzforumResponseHandler
  })
  if (result) {
    useMessage(InfoCode.MarkValidSuccess, 'success')
    await props.refresh()
  }
}

watch(
    () => [gameResourceStore.rewriteResourceId, props.link],
    () => {
      details.value = undefined
    }
)
</script>

<template>
  <div class="link">
    <div class="base">
      <div class="info">
        <span class="rewrite" v-if="link.grid === gameResourceStore.rewriteResourceId">
          <Icon class="icon" name="svg-spinners:12-dots-scale-rotate"></Icon>
          <span>{{ t('game.resource.edit') }}</span>
        </span>
        <span>
          <Icon class="icon" :name="typeIconMap[link.type]"></Icon>
          <span>{{ t(`game.resource.type.${link.type}`) }}</span>
        </span>
        <span>
          <Icon class="icon" name="lucide:database"></Icon>
          <span>{{ link.size }}</span>
        </span>
        <span>
          <Icon class="icon" :name="platformIconMap[link.platform]"></Icon>
          <span>{{ t(`game.resource.platform.${link.platform}`) }}</span>
        </span>
        <span>{{ t(`game.resource.language.${link.language}`) }}</span>
      </div>

      <div class="status">
        <span v-if="details" class="close" @click="details = undefined">
          <Icon class="icon" name="lucide:x"></Icon>
        </span>
        <YuzuButton class="valid" v-if="userStore.uid === link.uid && link.status === 1"
            @click="handleMarkValid(link.gid, link.grid)" :pending="isFetching">
          {{ t('game.resource.valid') }}
        </YuzuButton>
        <YuzuButton v-if="!details && link.grid !== gameResourceStore.rewriteResourceId"
            @click="handleGetDetail(link.grid)" :pending="isFetching">
          {{ t('game.resource.fetch') }}
        </YuzuButton>
        <GameResourceLike v-if="userStore.uid !== link.uid" :gid="link.gid" :grid="link.grid"
            :to-uid="link.uid" :likes="link.likes" v-tooltip="{
            message: {
              'en-us': 'Like',
              'ja-jp': 'いいね',
              'zh-cn': '点赞'
            },
            position: 'bottom'
          }"></GameResourceLike>
        <NuxtLink v-if="userStore.uid !== link.uid" to="/report" v-tooltip="{
            message: {
              'en-us': 'Report violation',
              'ja-jp': '違反の報告',
              'zh-cn': '举报违规'
            },
            position: 'bottom'
          }">
          <Icon class="icon" name="lucide:triangle-alert"></Icon>
        </NuxtLink>
        <span class="status-dot" :class="`status-${link.status}`"
            v-tooltip="{
            message: {
              'en-us': link.status ? 'Link expired' : 'Link valid',
              'ja-jp': link.status
                ? 'リンクが期限切れです'
                : 'リンクは有効です',
              'zh-cn': link.status ? '链接过期' : '链接有效'
            },
            position: 'bottom'
          }"></span>
      </div>
    </div>

    <GameResourceDetail v-if="details" :details="details" :refresh="props.refresh"></GameResourceDetail>

    <YuzuDivider margin="0 0 20px 0"></YuzuDivider>
  </div>
</template>

<style scoped lang="scss">
.base {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: var(--yzforum-trans-blue-0);
  border-radius: 10px;
  margin-bottom: 10px;

  & > span {
    padding: 3px 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
  }

  .icon {
    font-size: medium;
    margin-right: 5px;
  }

  .rewrite {
    user-select: none;
    color: var(--yzforum-red-5);
  }
}

.status {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-left: auto;

  & > span,
  a {
    color: var(--yzforum-font-color-3);
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .yuzu-button {
    margin-right: 20px;
    padding: 3px 10px;
  }

  .close {
    cursor: pointer;
    margin-right: 20px;
    font-size: 20px;
  }
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-0 {
  width: 10px;
  height: 10px;
  background-color: var(--yzforum-green-4);
  border-radius: 50%;
}

.status-1 {
  width: 10px;
  height: 10px;
  background-color: var(--yzforum-red-4);
  border-radius: 50%;
}
</style>