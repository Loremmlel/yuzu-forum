<script lang="ts" setup>
import {type Category, topicCategory} from "~/components/edit/utils/category";

const {t} = useI18n()

const tempEdit = useTempEditStore()
const persistEdit = usePersistEditTopicStore()

const selectedCategories = ref<string[]>([])

if (tempEdit.isTopicRewriting) {
  selectedCategories.value = tempEdit.category
} else {
  selectedCategories.value = persistEdit.category
}

function handleClickCategory(category: Category) {
  if (category.index === 1 && selectedCategories.value.includes('other')) {
    return
  }
  if (category.index === 3 && selectedCategories.value.includes('game')) {
    return
  }
  const index = selectedCategories.value.indexOf(category.name)
  if (index !== -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category.name)
  }

  if (tempEdit.isTopicRewriting) {
    tempEdit.category = selectedCategories.value
    tempEdit.section = []
  } else {
    persistEdit.category = selectedCategories.value
    persistEdit.section = []
  }
}
</script>

<template>
  <div class="categories">
    <Icon class="icon" name="lucide:layers-3"></Icon>
    <span v-for="category in topicCategory" :key="category.index" :class="{active: selectedCategories.includes(category.name)}" class="button"
          @click="handleClickCategory(category)">
      {{ t(`edit.topic.${category.name}`) }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.categories {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 17px 17px 0;

  .icon {
    font-size: 20px;
    color: var(--yzforum-font-color-1);
    margin-right: 10px;
  }
}

.button {
  height: 30px;
  padding: 0 20px;
  cursor: pointer;
  border: 1px solid var(--yzforum-trans-blue-2);
  background-color: transparent;
  color: var(--yzforum-blue-5);
  @include yz-center;
  font-size: 15px;
  white-space: nowrap;

  &:nth-child(2) {
    border-radius: 16px 0 0 16px;
  }

  &:nth-child(3) {
    border-left: transparent;
    border-right: transparent;
  }

  &:last-child {
    border-radius: 0 16px 16px 0;
  }
}

.active {
  background-color: var(--yzforum-blue-5);
  border: 1px solid var(--yzforum-blue-5);
  color: var(--yzforum-white);
}
</style>