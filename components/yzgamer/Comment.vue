<script lang="ts" setup>
const props = defineProps<{ uid: number }>()

const pageData = reactive({
  page: 1,
  limit: 50
})

const {data, status} = await useFetch(`/api/user/${props.uid}/comments`, {
  method: 'GET',
  query: pageData,
  ...yzforumResponseHandler
})
</script>

<template>
  <div v-if="data && data.comments.length" class="comment">
    <div v-for="(commentData, index) in data.comments" :key="index" class="item">
      <NuxtLink :to="`/topic/${commentData.tid}`">
        <div class="title">
          {{ commentData.content }}
        </div>
      </NuxtLink>
    </div>

    <YuzuPagination v-if="data.totalCount > 50" :limit="pageData.limit"
                    :page="pageData.page" :status="status"
                    :sum="data.totalCount" class="pagination"
                    @set-page="(newPage) => pageData.page = newPage"></YuzuPagination>
  </div>
</template>

<style lang="scss" scoped>
.item {
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: var(--shadow);
  cursor: pointer;

  a {
    border-radius: 10px;
    padding: 10px;
    height: 100%;
    color: var(--yzforum-font-color-3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;

    &:hover {
      color: var(--yzforum-blue-5);
      background-color: var(--yzforum-trans-blue-0);
    }
  }
}

.title {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>