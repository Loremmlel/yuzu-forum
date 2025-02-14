<script setup lang="ts">
interface Props {
  page: number
  limit: number
  sum: number
  status: UseFetchStatus
}

const props = defineProps<Props>()
const emit = defineEmits<{ setPage: [page: number] }>()

const {t} = useI18n()

const pageInput = ref(props.page)
const currentPage = ref(props.page)
const totalPages = computed(() => Math.ceil(props.sum / props.limit))

function gotoPage(page: number) {
  if (page < 1 || page > totalPages.value) {
    return
  }
  currentPage.value = page
  pageInput.value = page
  emit('setPage', page)
}

function handlePageInput() {
  const page = parseInt(pageInput.value.toString(), 10)
  if (!isNaN(page)) {
    gotoPage(page)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    gotoPage(currentPage.value + 1)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    gotoPage(currentPage.value - 1)
  }
}
</script>

<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1" aria-label="previous">
      <Icon class="icon" name="lucide:chevron-left"></Icon>
    </button>

    <div class="page">
      <input v-model="pageInput" @keyup.enter="handlePageInput" @blur="handlePageInput"
             type="number" :min="1" :max="totalPages">
      <span class="separator">/</span>
      <span>{{ totalPages }}</span>
    </div>

    <button @click="nextPage" :disabled="currentPage === totalPages" aria-label="next">
      <Icon class="icon" name="lucide:chevron-right"></Icon>
    </button>

    <div class="loading" v-if="props.status === 'pending'"></div>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  @include yz-center;
  width: 100%;
  margin: 20px 0;
  position: relative;

  button {
    padding: 5px 10px;
    border-radius: 10px;
    margin: 0 10px;
    border: none;
    background-color: transparent;
    font-size: medium;
    color: var(--yzforum-font-color-3);
    @include yz-center;

    &:hover {
      background-color: var(--yzforum-trans-blue-1);
    }

    &:disabled {
      &:hover {
        cursor: not-allowed;
        background-color: transparent;
      }
    }
  }

  .page {
    padding: 8px 12px;
    border: 1.5px solid var(--yzforum-trans-blue-2);
    border-radius: 10px;

    input {
      color: var(--yzforum-font-color-3);
      width: 50px;
      font-size: 16px;
      border: none;
      background-color: transparent;
      padding: 0;
    }

    .separator {
      margin-right: 10px;
    }
  }

  .loading {
    position: absolute;
    bottom: -10px;
    width: 300px;
    border: 2px dotted var(--yzforum-blue-5);
    animation: scaleXAnimation 1s infinite alternate;

    span {
      position: absolute;
    }
  }

  @keyframes scaleXAnimation {
    0% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }
}
</style>