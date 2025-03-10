<script setup lang="ts">
const {t} = useI18n()

const persistSearchStore = usePersistYzforumSearchStore()
const searchStore = useTempSearchStore()

function handleClickHistory(index: number) {
  searchStore.keywords = persistSearchStore.searchHistory[index]
}

function clearSearchHistory() {
  persistSearchStore.searchHistory = []
}

function handleDeleteHistory(index: number) {
  persistSearchStore.searchHistory.splice(index, 1)
}
</script>

<template>
  <div class="history">
    <div class="title" v-if="persistSearchStore.searchHistory.length">
      <span>{{ t('search.history') }}</span>
      <span @click="clearSearchHistory">
        {{ t('search.clear') }}
      </span>
    </div>

    <div class="history-container" v-if="persistSearchStore.searchHistory.length">
      <div class="single-history" v-for="(history, index) in persistSearchStore.searchHistory"
           @click="handleClickHistory(index)">
        <span>{{ history }} </span>
        <span class="delete">
          <Icon class="icon" @click="handleDeleteHistory(index)" name="lucide:x"></Icon>
        </span>
      </div>
    </div>

    <YuzuNull :condition="!persistSearchStore.searchHistory.length" type="null"></YuzuNull>
  </div>
</template>

<style scoped lang="scss">
.history {
  width: 100%;
  margin-top: 20px;
}

.title {
  display: flex;
  justify-content: space-between;

  span {
    font-size: 16px;
    &:nth-child(2) {
      cursor: pointer;

      &:hover {
        color: var(--yzforum-blue-5);
      }
    }
  }
}

.history-container {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-top: 10px;
}

.single-history {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  margin: 2px 0;
  border-radius: 10px;

  &:hover {
    color: var(--yzforum-blue-5);
    background-color: var(--yzforum-trans-blue-1);

    .delete {
      display: flex;
    }
  }

  span:nth-child(1) {
    cursor: default;
    position: relative;
    display: flex;
    overflow: hidden;
  }

  span:nth-child(2) {
    width: 20px;
  }
}

.delete {
  font-size: 20px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--yzforum-font-color-0);
  display: none;
}
</style>