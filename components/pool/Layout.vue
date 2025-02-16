<script lang="ts" setup>
import type {PoolTopic} from "~/types/api/pool";

defineProps<{ topics: PoolTopic[] }>()

const poolStore = usePersistPoolStore()
</script>

<template>
  <div v-if="poolStore.layout === 'grid'" class="grid">
    <PoolTopic v-for="(topic, index) in topics" :key="index" :topic="topic" class="item"></PoolTopic>
  </div>

  <div v-else class="list">
    <div v-for="(topic, index) in topics" :key="index">
      <HomeTopicCard :topic="topic"></HomeTopicCard>
      <YuzuDivider color="var(--yzforum-trans-blue-1)" margin="0 10px"></YuzuDivider>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  padding: 10px;
  @include yz-blur;
}

.list {
  padding: 10px;
  @include yz-blur;
}

@media (max-width: 700px) {
  .grid {
    grid-template-columns: repeat(2, minmax(100px, 233px));
    padding: 10px 0;
  }
}
</style>