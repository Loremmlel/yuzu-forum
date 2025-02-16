<script lang="ts" setup>
import {useTempPoolPageStore} from "~/store/temp/topic/pool";
import {usePersistPoolStore} from "~/store/modules/pool";

const {t} = useI18n()

const pageStore = useTempPoolPageStore()
const poolStore = usePersistPoolStore()
</script>

<template>
  <div class="tool">
    <div class="sort">
      <YuzuSelect :default-value="pageStore.sortField" :options="['created', 'views']"
                  :styles="{width: '100px'}" i18n="pool"
                  position="bottom" @set="(value) => pageStore.sortField = value as 'views' | 'created'">
        <span>{{ t(`pool.${pageStore.sortField}`) }}</span>
      </YuzuSelect>

      <YuzuSelect :default-value="pageStore.category" :options="['all', 'game', 'technique', 'other']"
                  :styles="{width: '150px'}" i18n="pool"
                  position="bottom"
                  @set="(value) => pageStore.category = value as 'all' | 'game' | 'technique' | 'other'">
        {{ t(`pool.${pageStore.category}`) }}
      </YuzuSelect>
    </div>

    <div class="func">
      <span :class="poolStore.layout === 'grid' ? 'active' : ''" @click="poolStore.layout = 'grid'">
        <Icon class="icon" name="lucide:layout-grid"></Icon>
      </span>
      <span :class="poolStore.layout === 'list' ? 'active' : ''" @click="poolStore.layout = 'list'">
        <Icon class="icon" name="lucide:list"></Icon>
      </span>
      <span :class="pageStore.sortOrder === 'asc' ? 'active' : ''" @click="pageStore.sortOrder = 'asc'">
        <Icon class="icon" name="lucide:arrow-up"></Icon>
      </span>
      <span :class="pageStore.sortOrder === 'desc' ? 'active' : ''" @click="pageStore.sortOrder = 'desc'">
        <Icon class="icon" name="lucide:arrow-down"></Icon>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool {
  padding: 10px;
  color: var(--yzforum-font-color-3);
  box-shadow: var(--shadow);
  background-color: var(--yzforum-trans-white-5);
  border-radius: 10px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  z-index: 20;

  .sort {
    display: flex;
  }

  .icon {
    font-size: 20px;
  }

  .func {
    display: flex;
    white-space: nowrap;

    & > span {
      display: flex;
      cursor: pointer;
      padding: 3px 10px;
      margin-right: 5px;
      border-radius: 10px;
    }

    .active {
      box-shadow: var(--shadow);
      color: var(--yzforum-blue-5);
    }
  }
}

@media (max-width: 700px) {
  .tool {
    .sort {
      margin-bottom: 8px;
    }

    .icon {
      font-size: 16px;
    }
  }
}
</style>