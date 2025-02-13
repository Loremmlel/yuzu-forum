<script setup lang="ts">
import type {TopicReply} from "~/types/api/topicReply";

const {t} = useI18n()

const props = defineProps<{
  replyData: TopicReply[]
  pending: boolean
  sortOrder: YuzuOrder
}>()

const emits = defineEmits<{ setSortOrder: [value: YuzuOrder] }>()
</script>

<template>
  <div class="tool" v-if="props.replyData && props.replyData.length > 5">
    <div class="order">
      <span :class="props.sortOrder === 'asc' ? 'active' : ''" @click="emits('setSortOrder', 'asc')">
        <Icon class="icon" name="lucide:arrow-up"></Icon>
      </span>
      <span :class="props.sortOrder === 'desc' ? 'active' : ''" @click="emits('setSortOrder', 'desc')">
        <Icon class="icon" name="lucide:arrow-down"></Icon>
      </span>
    </div>

    <span class="pending" v-if="pending">
      {{ t('search.loading') }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.tool {
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  @include yz-blur;
}

.order {
  display: flex;
  white-space: nowrap;

  .icon {
    font-size: 20px;
  }

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

.pending {
  margin-left: 10px;
  color: var(--yzforum-font-color-0);
  user-select: none;
}

@media (max-width: 700px) {
  .tool {
    margin-bottom: 10px;
  }
}
</style>