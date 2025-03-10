<script setup lang="ts">
import type {
  SearchResult, SearchResultComment,
  SearchResultGame,
  SearchResultReply,
  SearchResultTopic,
  SearchResultUser,
  SearchType
} from "~/types/api/search";

const persistSearchStore = usePersistYzforumSearchStore()
const searchStore = useTempSearchStore()

const props = defineProps<{
  results: SearchResult[],
  type: SearchType
}>()

function handleClick() {
  if (!persistSearchStore.searchHistory.includes(searchStore.keywords)) {
    persistSearchStore.searchHistory.unshift(searchStore.keywords)
  }
}
</script>

<template>
  <div class="result">
    <div class="container" v-if="props.type === 'topic'">
      <div v-for="topic in results">
        <HomeTopicCard @click="handleClick" :topic="topic as SearchResultTopic"></HomeTopicCard>
        <YuzuDivider margin="0 10px"></YuzuDivider>
      </div>
    </div>

    <div class="container" v-else-if="props.type === 'game'">
      <div v-for="game in results">
        <HomeGameCard @click="handleClick" :game="game as SearchResultGame"></HomeGameCard>
        <YuzuDivider margin="0 10px"></YuzuDivider>
      </div>
    </div>

    <div class="container" v-else-if="props.type === 'user'">
      <div v-for="user in results">
        <SearchUserCard :user="user as SearchResultUser"></SearchUserCard>
        <YuzuDivider margin="0 20px"></YuzuDivider>
      </div>
    </div>

    <div class="container" v-else-if="props.type === 'reply'">
      <div v-for="reply in results">
        <SearchReplyCommentCard :data="reply as SearchResultReply" type="reply"></SearchReplyCommentCard>
        <YuzuDivider margin="0 20px"></YuzuDivider>
      </div>
    </div>

    <div class="container" v-else-if="props.type === 'comment'">
      <div v-for="comment in results">
        <SearchReplyCommentCard :data="comment as SearchResultComment" type="comment"></SearchReplyCommentCard>
        <YuzuDivider margin="0 20px"></YuzuDivider>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result {
  width: 100%;
  margin-top: 20px;
}
</style>