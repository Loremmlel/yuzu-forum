<script setup lang="ts">
const {t} = useI18n()

const searchStore = useTempSearchStore()
const input = ref<HTMLInputElement | null>(null)
const inputValue = ref('')

onBeforeMount(() => {
  searchStore.keywords = ''
})

const debouncedSearch = debounce((inputValue: string) => {
  if (inputValue.trim()) {
    searchStore.keywords = inputValue.trim()
  } else {
    searchStore.keywords = ''
  }
}, 500)

watch(
    () => searchStore.keywords,
    () => {
      if (!inputValue.value) {
        inputValue.value = searchStore.keywords
      }
    }
)

onMounted(() => {
  if (input.value) {
    input.value?.focus()
  }
})
</script>

<template>
  <input ref="input" v-model="inputValue" type="search" class="input" :placeholder="t('search.placeholder')"
      @input="debouncedSearch(inputValue)" @keydown.enter="debouncedSearch(inputValue)">
</template>

<style scoped lang="scss">
.input {
  padding: 0 15px;
  height: 40px;
  width: 100%;
  font-size: 16px;
  background-color: transparent;
  border: 2px solid var(--yzforum-blue-5);
  border-radius: 10px;
  color: var(--yzforum-font-color-3);
  transition: all 0.2s;

  &:focus {
    border: 2px solid var(--yzforum-pink-4);
  }

  &::placeholder {
    color: var(--yzforum-font-color-1);
  }
}
</style>