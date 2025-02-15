<script setup lang="ts">
import type {PoolTopic} from "~/types/api/pool";

defineProps<{ topics: PoolTopic[] }>()

const poolStore = usePersistPoolStore()
</script>

<template>
  <div class="grid" v-if="poolStore.layout === 'grid'">
    <PoolTopic v-for="(topic, index) in topics" :key="index" class="item" :topic="topic"></PoolTopic>
  </div>

  <div class="list" v-else>
    <div v-for="(topic, index) in topics" :key="index">
      <HomeTopicCard :topic="topic"></HomeTopicCard>
      <YuzuDivider margin="0 10px" color="var(--yzforum-trans-blue-1)"></YuzuDivider>
    </div>
  </div>
</template>

<style scoped lang="scss">
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