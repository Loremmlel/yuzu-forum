<script setup lang="ts">
const {locale} = useI18n()
const localePath = useLocalePath()

const props = defineProps<{ section: string }>()
const page = ref(1)

const {data, status} = await useFetch('/api/section', {
  method: 'GET',
  query: {
    section: props.section,
    order: 'desc',
    page,
    limit: 23
  },
  key: 'section',
  ...yzforumResponseHandler
})

watch(
    () => status.value,
    () => {
      if (status.value === 'success') {
        window?.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
)
</script>

<template>
  <NuxtLink class="section" v-for="topic in data?.topics" :to="`/topic/${topic.tid}`">
    <div class="avatar" @click.prevent="navigateTo(localePath(`/yzgamer/${topic.user.uid}/info`))">
      <NuxtImg height="50" width="50" v-if="topic.user.avatar" :src="topic.user.avatar.replace(/\.webp$/, '-100.webp')"
               :alt="topic.user.name"></NuxtImg>
      <span v-else>
        {{ topic.user.name.slice(0, 1).toUpperCase() }}
      </span>
    </div>

    <div class="topic">
      <div class="user">
        <div class="name">{{ topic.user.name }}</div>
        <div class="time">
          {{ formatDate(topic.time, locale, {showYear: true, isPrecise: true}) }}
        </div>
      </div>

      <div class="title">
        {{ topic.title }}
      </div>

      <TopicTags :tags="topic.tags" :show-icon="false"></TopicTags>

      <div class="content">
        {{ markdownToText(topic.content) }}
      </div>

      <div class="status">
      <span>
        <Icon class="icon" name="lucide:mouse-pointer-click"></Icon>
          <span>{{ topic.views }}</span>
        </span>
        <span>
        <Icon class="icon" name="lucide:thumbs-up"></Icon>
          <span>
            {{ topic.likes }}
          </span>
        </span>
        <span>
        <Icon class="icon" name="lucide:reply"></Icon>
          <span>{{ topic.replies }}</span>
        </span>
      </div>
    </div>
  </NuxtLink>

  <YuzuPagination class="pagination" v-if="data?.totalCount" :page="page" :limit="23"
                  :sum="data?.totalCount" :status="status" @set-page="newPage => page = newPage"></YuzuPagination>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  padding: 20px;
  cursor: pointer;
  color: var(--yzforum-font-color-3);

  &:hover {
    background-color: var(--yzforum-trans-blue-1);
    transition: all 0.2s;
  }
}

.avatar {
  display: flex;
  justify-content: center;
  margin-right: 10px;

  img {
    border-radius: 50%;
    display: inline-block;
  }

  span {
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--yzforum-blue-5);
    font-weight: bold;
  }
}

.user {
  display: flex;
  align-items: center;

  .name {
    font-weight: bold;
    margin-right: 5px;
  }

  .time {
    font-size: small;
    color: var(--yzforum-font-color-0);
  }
}

.title {
  color: var(--yzforum-blue-5);
  margin: 5px 0;
}

.content {
  word-break: break-all;
  font-size: small;
  margin: 10px 0;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  -webkit-box-orient: vertical;
}

.status {
  display: flex;
  color: var(--yzforum-font-color-1);

  .icon {
    margin-right: 4px;
  }

  span {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
}

.pagination {
  margin: 50px 0;
}

@media (max-width: 700px) {
  .pagination {
    margin: 20px 0;
  }
}
</style>