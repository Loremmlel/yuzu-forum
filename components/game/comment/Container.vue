<script setup lang="ts">
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

  <div class="to-user" v-if="toUser">
    <div>{{ t('game.comment.to') }}</div>
    <YuzuSelect :styles="{width: '100%'}" :selector-styles="{justifyContent: 'flex-start'}"
                :options="userData.map(user => user.name)" :discard-i18n="true"
                @set="handleSetUserInfo" position="bottom">
      {{ username }}
    </YuzuSelect>
  </div>

  <div class="panel">
    <GameCommentPanel :to-user="toUser" :refresh="refresh">
      <YuzuNav class="nav" v-if="data && data.totalCount" :items="orderItems"
               :default-value="pageData.order" @set="(value) => pageData.order = value as string"></YuzuNav>
    </GameCommentPanel>

    <div class="sad" v-if="!data?.totalCount && status !== 'pending'">
      {{ t('game.comment.sad') }}
    </div>

    <div class="comments" v-if="status === 'success' && data && data.totalCount">
      <GameComment v-for="comment in data.comments" :key="comment.gcid" :comment="comment"
                   :refresh="refresh"></GameComment>
      <YuzuPagination class="pagination" v-if="data.totalCount > 10"
                      :page="pageData.page" :limit="pageData.limit" :sum="data.totalCount" :status="status"
                      @set-page="(newPage) => pageData.page = newPage"></YuzuPagination>
    </div>
  </div>
  <YuzuFooter></YuzuFooter>
  <YuzuSkeletonGameComment v-if="status === 'pending'"></YuzuSkeletonGameComment>
</template>

<style scoped lang="scss">
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