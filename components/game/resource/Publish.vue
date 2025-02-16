<script lang="ts" setup>
import type {GameResourceStoreTemp} from "~/store/types/game/resource";
import {languageOptions, platformOptions, typeOptions} from "~/components/game/utils/option";
import {InfoCode} from "~/code&message/infoCode";

const {locale, t} = useI18n()

const props = defineProps<{ refresh: () => Promise<unknown> }>()

const route = useRoute()
const gid = ref(route.params.gid as string)

const gameResourceStore = useTempGameResourceStore()

const isFetching = ref(false)

const defaultResourceLink: GameResourceStoreTemp = {
  type: 'game',
  link: [],
  language: locale.value,
  platform: 'windows',
  size: '',
  code: '',
  password: '',
  note: ''
}
const resourceLink = ref({...defaultResourceLink})

async function handlePublishResourceLink(method: 'POST' | 'PUT') {
  const linkArray = resourceLink.value.link.toString().split(',').map(l => l.trim())
  if (!checkGameResourcePublish({...resourceLink.value, link: linkArray})) {
    return
  }
  isFetching.value = true
  const result = await $fetch(`/api/game/${gid.value}/resource`, {
    method,
    query: gameResourceStore.rewriteResourceId ? {grid: gameResourceStore.rewriteResourceId} : {},
    body: {
      ...resourceLink.value,
      link: linkArray
    },
    watch: false,
    ...yzforumResponseHandler
  })
  isFetching.value = false

  if (result) {
    if (!gameResourceStore.rewriteResourceId) {
      useMessage(InfoCode.ResourcePublishSuccess, 'success')
    } else {
      gameResourceStore.rewriteResourceId = 0
      useMessage(InfoCode.ResourceUpdateSuccess, 'success')
    }
    await props.refresh()
    resourceLink.value = {...defaultResourceLink}
  }
}

function handleCancel() {
  gameResourceStore.rewriteResourceId = 0
  resourceLink.value = {...defaultResourceLink}
  gameResourceStore.resources[0] = resourceLink.value
}

watch(
    () => gameResourceStore.rewriteResourceId,
    () => {
      if (gameResourceStore.rewriteResourceId) {
        resourceLink.value = gameResourceStore.resources[0]
      }
    }
)

onMounted(() => {
  if (gameResourceStore.rewriteResourceId) {
    resourceLink.value = gameResourceStore.resources[0]
  }
})

function checkGameResourcePublish(link: GameResourceStoreTemp) {
  if (!typeOptions.filter((item) => item !== 'all').includes(link.type)) {
    useMessage(InfoCode.InvalidResourceType, 'warn')
    return false
  }

  if (!link.link.length || link.link.length > 107) {
    useMessage(InfoCode.ResourceLinksRequired, 'warn')
    return false
  }
  for (const l of link.link) {
    if (l.trim().length > 1007) {
      useMessage(InfoCode.ResourceLinksLimit, 'warn')
      return false
    }
    if (!isValidURL(l.trim())) {
      useMessage(InfoCode.InvalidResourceUrl, 'warn')
      return false
    }
  }
  if (!languageOptions.filter((item) => item !== 'all').includes(link.language)) {
    useMessage(InfoCode.InvalidResourceLanguage, 'warn')
    return false
  }
  if (!platformOptions.filter((item) => item !== 'all').includes(link.platform)) {
    useMessage(InfoCode.InvalidResourcePlatform, 'warn')
    return false
  }
  if (!resourceSizePattern.test(link.size)) {
    useMessage(InfoCode.InvalidResourceSize, 'warn')
    return false
  }
  if (link.code.length > 1007) {
    useMessage(InfoCode.ExtractionCodeLimit, 'warn')
    return false
  }
  if (link.password.length > 1007) {
    useMessage(InfoCode.DecompressionCodeLimit, 'warn')
    return false
  }
  if (link.note.length > 1007) {
    useMessage(InfoCode.ResourceNoteLimit, 'warn')
    return false
  }
  return true
}
</script>

<template>
  <GameResourceHelp></GameResourceHelp>

  <div class="link">
    <YuzuTextarea v-model="resourceLink.link" :placeholder="`${t('game.resource.placeholder.link')}`"></YuzuTextarea>
    <div>
      <YuzuInput v-model="resourceLink.size" :placeholder="t('game.resource.placeholder.size')"></YuzuInput>
      <YuzuInput v-model="resourceLink.code" :placeholder="t('game.resource.placeholder.extract')"></YuzuInput>
      <YuzuInput v-model="resourceLink.password" :placeholder="t('game.resource.placeholder.decompress')"></YuzuInput>
    </div>
  </div>

  <div class="type">
    <YuzuSelect :options="typeOptions.filter(e => e !== 'all')" :styles="{width: '200px'}"
                class="yuzu-select"
                default-value="game" i18n="game.resource.type"
                position="top" @set="(value) => resourceLink.type = value">
      <div class="select">
        <span>{{ t('game.resource.type.name') }}</span>
        <span v-if="resourceLink.type">
          {{ t(`game.resource.type.${resourceLink.type}`) }}
        </span>
      </div>
    </YuzuSelect>

    <YuzuSelect :default-value="locale" :options="languageOptions.filter(e => e !== 'all')"
                :styles="{width: '200px'}"
                class="yuzu-select" i18n="game.resource.language"
                position="top" @set="(value) => resourceLink.language = value">
      <div class="select">
        <span>{{ t('game.resource.language.name') }}</span>
        <span v-if="resourceLink.language">
          {{ t(`game.resource.language.${resourceLink.language}`) }}
        </span>
      </div>
    </YuzuSelect>

    <YuzuSelect :options="platformOptions.filter(e => e !== 'all')" :styles="{width: '200px'}"
                class="yuzu-select"
                default-value="windows" i18n="game.resource.platform"
                position="top" @set="(value) => resourceLink.platform = value">
      <div class="select">
        <span>{{ t('game.resource.platform.name') }}</span>
        <span v-if="resourceLink.platform">
          {{ t(`game.resource.platform.${resourceLink.platform}`) }}
        </span>
      </div>
    </YuzuSelect>
  </div>

  <div class="note">
    <YuzuTextarea v-model="resourceLink.note" :placeholder="`${t('game.resource.placeholder.note')}`"></YuzuTextarea>
  </div>

  <div class="button">
    <YuzuButton v-if="!gameResourceStore.rewriteResourceId" :pending="isFetching"
                type="primary" @click="handlePublishResourceLink('POST')">
      {{ t('game.resource.create') }}
    </YuzuButton>
    <YuzuButton v-if="gameResourceStore.rewriteResourceId" @click="handleCancel">
      {{ t('game.resource.cancelRewrite') }}
    </YuzuButton>
    <YuzuButton v-if="gameResourceStore.rewriteResourceId" :pending="isFetching" class="rewrite"
                type="danger" @click="handlePublishResourceLink('PUT')">
      {{ t('game.resource.confirmRewrite') }}
    </YuzuButton>
  </div>
</template>

<style lang="scss" scoped>
.link {
  display: flex;
  flex-direction: column;

  & > div {
    margin-top: 10px;

    input {
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }
}

.type {
  display: flex;
  flex-wrap: wrap;
}

.yuzu-select {
  padding: 10px;
  background-color: var(--yzforum-trans-blue-0);
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.select {
  display: flex;
  flex-direction: column;

  span {
    &:first-child {
      font-size: small;
      color: var(--yzforum-font-color-0);
    }
  }
}

.note {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  button {
    margin: 17px 0;
  }
}

.button {
  margin-bottom: 10px;
  display: flex;
  width: 100%;

  button {
    width: 100%;
  }

  .rewrite {
    margin-left: 10px;
  }
}
</style>