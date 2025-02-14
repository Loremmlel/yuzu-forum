<script lang="ts" setup>
import type {HomeGameResources} from "~/types/api/home";

const {t} = useI18n()

const resourceData = ref<HomeGameResources[] | null>()
const pageData = reactive({
  page: 1,
  limit: 10
})

const {data, status} = await useFetch('/api/home/resource', {
  method: 'GET',
  query: pageData
})
resourceData.value = data.value

watch(
    () => [pageData.page, status.value],
    () => {
      if (data.value && status.value === 'success' && pageData.page > 1) {
        resourceData.value = resourceData.value?.concat(data.value)
      }
    }
)

function handleClose() {
  resourceData.value = resourceData.value?.slice(0, 10)
  pageData.page = 1
}
</script>

<template>
  <div class="container" v-if="resourceData">
    <HomeResourceLink v-for="resource in resourceData" :key="resource.grid" :link="resource"></HomeResourceLink>
  </div>

  <HomeLoader v-model="pageData.page" :status="status">
    <span v-if="pageData.page !== 1" class="close" @click="handleClose">
      {{ t('home.fold') }}
    </span>
  </HomeLoader>
</template>

<style lang="scss" scoped>
.close {
  margin-left: 20px;
  cursor: pointer;
  padding-right: 20px;

  &:hover {
    color: var(--yzforum-blue-5);
  }
}
</style>