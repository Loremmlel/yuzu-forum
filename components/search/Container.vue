<script setup lang="ts">
import type {SearchResult, SearchType} from "~/types/api/search";
import {navItems} from "~/components/search/items";

const {t} = useI18n()

const searchStore = useTempSearchStore()

const results = ref<SearchResult[]>([])
const isLoading = ref(false)
const isLoadComplete = ref(false)
const pageData = reactive({
  type: 'topic' as SearchType,
  page: 1,
  limit: 10
})

async function searchQuery() {
  isLoading.value = true
  const result = await $fetch('/api/search', {
    method: 'GET',
    query: {
      keywords: searchStore.keywords,
      ...pageData
    }
  })
  if (result.length < 10) {
    isLoadComplete.value = true
  }
  isLoading.value = false
  return result
}

async function handleSetType(value: SearchType) {
  pageData.type = value
  pageData.page = 1
  results.value = []
  if (searchStore.keywords) {
    results.value = await searchQuery()
  } else {
    isLoading.value = false
  }
}

watch(
    () => searchStore.keywords,
    async () => {
      if (searchStore.keywords) {
        results.value = await searchQuery()
      } else {
        results.value = []
        isLoading.value = false
      }
    }
)

async function handleLoadMore() {
  pageData.page++
  const newData = await searchQuery()
  results.value = results.value.concat(newData)
}
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{t('search.name')}}
    </template>
  </YuzuHeader>
  <div class="container">
    <div class="nav">
      <YuzuNav :items="navItems" :default-value="pageData.type" @set="value => handleSetType(value as SearchType)"></YuzuNav>
    </div>
    <SearchBox></SearchBox>
    <SearchHistory v-if="!searchStore.keywords"></SearchHistory>
    <SearchResult :results="results" :type="pageData.type" v-if="results.length"></SearchResult>
    <YuzuDivider v-if="results.length >= 10" margin="30px" padding="0 20px">
      <slot></slot>
      <span class="loader" v-if="!isLoading && !isLoadComplete" @click="handleLoadMore">
        {{ t('search.load') }}
      </span>
      <span v-if="isLoading">
        {{ t('search.loading') }}
      </span>
      <span v-if="isLoadComplete">
        {{ t('search.complete') }}
      </span>
    </YuzuDivider>
    <span class="empty" v-if="!results.length && searchStore.keywords && !isLoading">
      {{ t('search.emptyResult') }}
    </span>
    <span class="loading" v-if="isLoading">
      {{ t('search.loading') }}
    </span>
  </div>
  <YuzuFooter></YuzuFooter>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.nav {
  margin-bottom: 20px;
  overflow-x: scroll;
  height: 35px;

  &::-webkit-scrollbar {
    height: 1px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--yzforum-gray-4);
  }
}

.yuzu-divider {
  font-size: 16px;

  span {
    &:first-child {
      padding-left: 20px;
    }

    &:last-child {
      padding-right: 20px;
    }
  }

  .loader {
    cursor: pointer;

    &:hover {
      color: var(--yzforum-blue-5);
    }
  }
}

.empty {
  display: flex;
  justify-content: center;
  color: var(--yzforum-font-color-1);
  font-style: oblique;
  margin-top: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  color: var(--yzforum-blue-2);
  margin-top: 20px;
}

.yuzu-footer {
  margin-top: auto;
}

@media (max-width: 1000px) {
  .container {
    width: 60vw;
  }
}

@media (max-width: 700px) {
  .container {
    width: 90vw;
  }
}
</style>