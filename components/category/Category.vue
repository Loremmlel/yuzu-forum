<script lang="ts" setup>
import type {CategoryResponseData} from "~/types/api/category";

const {t} = useI18n()

const availableCategory = ['game', 'technique', 'other']
const categoryStore = usePersistCategoryStore()
const sections = ref<CategoryResponseData[]>([])
const status = ref<UseFetchStatus>('idle')

watch(
    () => categoryStore.category,
    () => {
      fetchData()
    }
)

async function fetchData() {
  sections.value = []
  status.value = 'pending'
  const result = await $fetch('/api/category', {
    method: 'GET',
    query: {
      category: categoryStore.category
    },
    watch: false,
    ...yzforumResponseHandler
  })
  if (result) {
    sections.value = result as CategoryResponseData[]
    status.value = 'success'
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div class="category">
    <div class="title">
      <span v-for="(category, index) in availableCategory" :key="index"
            :class="categoryStore.category === category ? 'active' : ''"
            @click="categoryStore.category = category as 'game' | 'technique' | 'other'">
        {{ t(`category.${category}`) }}
      </span>
    </div>

    <CategorySections v-if="sections.length && status === 'success'" :sections="sections"></CategorySections>
    <YuzuSkeletonCategory v-if="status === 'pending'"></YuzuSkeletonCategory>

    <p class="hint">{{ t('category.update') }}</p>
    <YuzuFooter></YuzuFooter>
  </div>
</template>

<style lang="scss" scoped>
.category {
  width: 100%;
  height: 100%;
  padding: 20px;

  @include yz-blur;
}

.title {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 0 20px;

  span {
    font-size: 20px;
    cursor: pointer;
    flex-wrap: nowrap;

    &:nth-child(2) {
      &::before {
        content: '/';
        font-size: 20px;
        color: var(--yzforum-font-color-0);
        margin: 0 10px;
      }

      &::after {
        content: '/';
        font-size: 20px;
        color: var(--yzforum-font-color-0);
        margin: 0 10px;
      }
    }
  }

  .active {
    color: var(--yzforum-blue-5);
    font-size: 25px;
    transition: all 0.2s;
  }
}

.hint {
  display: flex;
  justify-content: flex-end;
  font-size: small;
  font-style: oblique;
  color: var(--yzforum-font-color-0);
  margin: 10px 0;
}

@media (max-width: 700px) {
  .category {
    padding: 10px;
  }

  .title {
    margin-bottom: 10px;
    padding: 0 10px;

    span {
      font-size: 18px;
    }
  }
}
</style>