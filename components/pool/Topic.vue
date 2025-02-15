<script setup lang="ts">
import type {PoolTopic} from "~/types/api/pool";

const props = defineProps<{topic: PoolTopic}>()

const actionsCount = computed(() => props.topic.comments + props.topic.replies)
</script>

<template>
  <NuxtLink class="topic" :to="`/topic/${topic.tid}`" v-yuzu-gradient="{
    color: '--yzforum-trans-blue-0',
    radius: 70
  }">
    <div class="title">{{topic.title}}</div>
    <PoolUser :user="topic.user" :time="topic.time"></PoolUser>
    <PoolIntroduction :section="topic.section" :tags="topic.tags"></PoolIntroduction>

    <div class="status">
      <span>
        <Icon class="icon" name="lucide:mouse-pointer-click"></Icon>
        <span>{{topic.views}}</span>
      </span>
      <span>
        <Icon class="icon" name="lucide:thumbs-up"></Icon>
        <span v-if="topic.likes">{{topic.likes}}</span>
      </span>
      <span>
        <Icon class="icon" name="lucide:reply"></Icon>
        <span v-if="actionsCount">{{actionsCount}}</span>
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.topic {
  display: flex;
  flex-direction: column;
  color: var(--yzforum-font-color-3);
  cursor: pointer;
  max-width: 300px;
  padding: 10px;
  transition: all 0.2s;
  border-radius: 10px;

  &:hover {
    box-shadow: var(--shadow);

    .title {
      color: var(--yzforum-blue-5);
    }
  }
}

.title {
  font-size: 18px;
  color: var(--yzforum-font-color-3);
}

.status {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  margin-top: 10px;

  span {
    display: flex;
    align-items: center;
    margin-right: 8px;

    span {
      margin-left: 4px;
    }
  }
}
</style>