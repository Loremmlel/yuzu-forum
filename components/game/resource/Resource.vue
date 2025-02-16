<script lang="ts" setup>
const {t} = useI18n()

const route = useRoute()
const gid = ref(route.params.gid as string)

const gameResourceStore = useTempGameResourceStore()

const {data, status, refresh} = await useLazyFetch(`/api/game/${gid.value}/resource/all`, {
  method: 'GET',
  ...yzforumResponseHandler
})

function handleClickContribute() {
  if (!gameResourceStore.rewriteResourceId) {
    gameResourceStore.showPublish = !gameResourceStore.showPublish
  }
}

watch(
    () => gameResourceStore.rewriteResourceId,
    () => {
      gameResourceStore.showPublish = !!gameResourceStore.rewriteResourceId;
    }
)
</script>

<template>
  <div class="resource">
    <YuzuHeader :size="2">
      <template #header>
        <span>{{ t('game.resource.name') }}</span>
        <span class="contribute" @click="handleClickContribute">
          <Icon class="icon" name="lucide:circle-plus"></Icon>
        </span>
      </template>
    </YuzuHeader>

    <div class="note">
      <div>{{ t('game.resource.proxy') }}</div>
    </div>

    <GameNull v-if="!data?.length" class="null"></GameNull>

    <GameResourcePublish v-if="gameResourceStore.showPublish" :refresh="refresh"></GameResourcePublish>

    <div v-if="status === 'success'">
      <GameResourceLink v-for="resource in data" :key="resource.grid"
                        :link="resource" :refresh="refresh"></GameResourceLink>
    </div>
    <YuzuSkeletonGameResource v-if="status === 'pending'"></YuzuSkeletonGameResource>
  </div>
</template>

<style lang="scss" scoped>
.resource {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.contribute {
  cursor: pointer;
  margin-left: 20px;
  padding: 3px;
  border-radius: 20px;
  color: var(--yzforum-blue-5);
}

.note {
  margin-bottom: 20px;
  font-size: small;

  & > div {
    display: block;

    &:first-child {
      color: var(--yzforum-red-5);
      font-weight: bold;
      font-style: oblique;
    }

    &:last-child {
      margin-top: 5px;
    }
  }

  a {
    font-weight: bold;
    color: var(--yzforum-blue-5);
    text-decoration: underline;
    text-underline-offset: 3px;
    margin: 0 10px;
  }
}

.null {
  margin-bottom: 20px;
}
</style>