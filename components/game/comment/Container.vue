<script lang="ts" setup>
const props = defineProps<{
  userData: YuzuUser[]
  toUser: YuzuUser
}>()
const route = useRoute()

const {t} = useI18n()

const gameResourceStore = useTempGameResourceStore()

const username = ref(props.toUser.name)
const gid = ref(route.params.gid as string)

const pageData = reactive({
  page: 1,
  limit: 10,
  order: 'desc'
})

const orderItems = [
  {
    icon: 'lucide:arrow-up',
    value: 'asc'
  },
  {
    icon: 'lucide:arrow-down',
    value: 'desc'
  }
]

const {data, status, refresh} = await useLazyFetch(`/api/game/${gid.value}/comment/all`, {
      method: 'GET',
      query: pageData,
      ...yzforumResponseHandler
    }
)

function handleSetUserInfo(name: string) {
  username.value = name
  gameResourceStore.commentToUid = props.userData.find((user) => user.name === name)?.uid || props.toUser.uid
}

onMounted(() => (gameResourceStore.commentToUid = props.toUser.uid))
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{ t('game.comment.name') }}
    </template>
  </YuzuHeader>

  <div v-if="toUser" class="to-user">
    <div>{{ t('game.comment.to') }}</div>
    <YuzuSelect :discard-i18n="true" :options="userData.map(user => user.name)"
                :selector-styles="{justifyContent: 'flex-start'}" :styles="{width: '100%'}"
                position="bottom" @set="handleSetUserInfo">
      {{ username }}
    </YuzuSelect>
  </div>

  <div class="panel">
    <GameCommentPanel :refresh="refresh" :to-user="toUser">
      <YuzuNav v-if="data && data.totalCount" :default-value="pageData.order" :items="orderItems"
               class="nav" @set="(value) => pageData.order = value as string"></YuzuNav>
    </GameCommentPanel>

    <div v-if="!data?.totalCount && status !== 'pending'" class="sad">
      {{ t('game.comment.sad') }}
    </div>

    <div v-if="status === 'success' && data && data.totalCount" class="comments">
      <GameComment v-for="comment in data.comments" :key="comment.gcid" :comment="comment"
                   :refresh="refresh"></GameComment>
      <YuzuPagination v-if="data.totalCount > 10" :limit="pageData.limit"
                      :page="pageData.page" :status="status" :sum="data.totalCount" class="pagination"
                      @set-page="(newPage) => pageData.page = newPage"></YuzuPagination>
    </div>
  </div>
  <YuzuFooter></YuzuFooter>
  <YuzuSkeletonGameComment v-if="status === 'pending'"></YuzuSkeletonGameComment>
</template>

<style lang="scss" scoped>
.to-user {
  display: flex;
  align-items: center;
  margin-top: 20px;

  & > div {
    white-space: nowrap;
    margin-right: 10px;
  }
}

.panel {
  margin-top: 10px;
}

.notice {
  font-size: small;
  color: var(--yzforum-blue-5);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.sad {
  display: flex;
  justify-content: center;
  color: var(--yzforum-blue-2);
  font-style: oblique;
  margin: 10px 0;
  font-size: 15px;
}
</style>