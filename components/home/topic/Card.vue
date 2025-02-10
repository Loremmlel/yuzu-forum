<script lang="ts" setup>
import {NuxtLinkLocale} from "#components";
import type {HomeTopic} from "~/types/api/home";

const {locale, t} = useI18n()

const props = defineProps<{ topic: HomeTopic }>()
</script>

<template>
  <NuxtLinkLocale v-yuzu-gradient :to="`/topic/${topic.tid}`" class="topic">
    <div class="title">
      <span>{{ topic.title }}</span>
      <span>{{ formatTimeDiff(topic.time, locale) }}</span>
    </div>

    <div class="info">
      <div class="section">
        <span class="username">{{ topic.user.name }}</span>
        <HomeTopicSection :section="topic.section"></HomeTopicSection>
        <TopicTags :show-icon="false" :tags="topic.tags" class="tags"></TopicTags>
      </div>

      <div class="status">
        <span>
          <Icon class="icon" name="lucide:moouse-pointer-click"></Icon>
          <span>{{ topic.views }}</span>
        </span>
        <span>
          <Icon class="icon" name="lucide:thumbs-up"></Icon>
          <span>{{ topic.likes }}</span>
        </span>
        <span>
          <Icon class="icon" name="lucide:reply"></Icon>
          <span>{{ topic.replies + topic.comments }}</span>
        </span>
      </div>
    </div>

    <div v-if="hourDiff(topic.upvoteTime, 10)" class="featured">
      <Icon name="lucide:sparkles"></Icon>
    </div>
  </NuxtLinkLocale>
</template>

<style lang="scss" scoped>
.topic {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--yzforum-font-color-3);
  padding: 10px 10px 0;
  border-radius: 10px;
  position: relative;
}

.title {
  width: 100%;
  font-size: 18px;
  margin-bottom: 8px;

  span {
    &:last-child {
      color: var(--yzforum-font-color-0);
      font-size: small;
      font-weight: inherit;
      margin-left: 18px;
      white-space: nowrap;
    }
  }
}

.info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 10px;
  font-size: small;
}

.section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .username {
    color: var(--yzforum-font-color-0);
    font-size: 15px;

    &::after {
      content: '|';
      color: var(--yzforum-gray-4);
      margin-left: 10px;
    }
  }
}

.status {
  display: flex;

  .icon {
    margin-right: 3px;
  }

  span {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.featured {
  position: absolute;
  right: 10px;
  font-size: 36px;
  color: var(--yzforum-yellow-2);
  @include yz-center;
}

@media (max-width: 700px) {
  .tags {
    display: none;
  }
}
</style>