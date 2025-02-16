<script lang="ts" setup>


import type {TopicReply} from "~/types/api/topicReply";

const {locale, t} = useI18n()

defineProps<{
  reply: TopicReply
  title: string
}>()
const emits = defineEmits<{ scrollPage: [scrollToReplyId: number] }>()

const tempReplyStore = useTempReplyStore()

watch(
    () => tempReplyStore.scrollToReplyId,
    async () => {
      if (tempReplyStore.scrollToReplyId !== -1) {
        await nextTick()
        emits('scrollPage', tempReplyStore.scrollToReplyId)
        tempReplyStore.scrollToReplyId = -1
      }
    }
)
</script>

<template>
  <div :id="`k${reply.floor}`" :class="hourDiff(reply.upvoteTime, 10) ? 'active-upvote' : ''" class="reply">
    <div class="floor">
      <NuxtLink :to="`/topic/${reply.tid}#k${reply.floor}`">
        {{ reply.floor }}
      </NuxtLink>
    </div>

    <div class="content">
      <div class="article">
        <TopicYzgamerInfo :user="reply.user">
          <div class="reply-mobile">
            =>
            <span @click="tempReplyStore.scrollToReplyId = reply.toFloor">
              {{ reply.toUser.name }}
            </span>
          </div>
        </TopicYzgamerInfo>

        <div class="right">
          <div class="reply-to">
            {{ `${t('topic.panel.to')} @` }}
            <span @click="tempReplyStore.scrollToReplyId = reply.toFloor">
              {{ reply.toUser.name }}
            </span>
          </div>
          <YuzuContent :content="reply.content"></YuzuContent>
        </div>
      </div>

      <div class="bottom">
        <TopicTags :show-icon="true" :tags="reply.tags"></TopicTags>
        <p class="time">
          <span>{{ formatDate(reply.time, locale, {showYear: true, isPrecise: true}) }}</span>
          <s v-if="reply.edited" v-tooltip="{
            message: {
                'en-us': 'Rewrite Time',
                'ja-jp': 'Rewrite 時間',
                'zh-cn': 'Rewrite 时间'
              },
              position: 'bottom'
          }" class="rewrite">
            ×
            {{ formatDate(reply.edited, locale, {showYear: true, isPrecise: true}) }}
          </s>
        </p>
      </div>
    </div>
    <TopicReplyFooter :reply="reply" :title="title"></TopicReplyFooter>
    <TopicComment :comments-data="reply.comment" :rid="reply.rid"></TopicComment>
  </div>
</template>

<style lang="scss" scoped>
.reply {
  width: 100%;
  flex-shrink: 0;
  padding: 10px;
  margin-bottom: 20px;
  position: relative;

  @include yz-blur;
  @include yz-center;
  flex-direction: column;
}

.floor {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  font-weight: bold;
  font-style: oblique;
  border-bottom: none;

  a {
    color: var(--yzforum-gray-4);
    padding-left: 5px;
    text-align: center;
    font-size: 20px;
  }
}

.content {
  width: 100%;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
}

.article {
  display: flex;
  flex-grow: 1;
}

.bottom {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;

  .time {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--yzforum-font-color-1);
    padding: 0 20px;
    margin-top: 5px;

    .rewrite {
      color: var(--yzforum-blue-5);
    }
  }
}

.right {
  width: 100%;
  display: flex;
  flex-direction: column;

  .reply-to {
    display: flex;
    align-items: center;
    margin: 10px 0;
    letter-spacing: 1px;

    span {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: var(--yzforum-blue-5);
      font-weight: bold;
      margin-left: 5px;

      &::after {
        content: '➢';
        color: var(--yzforum-red-4);
        margin-left: 10px;
        transform: translateX(0);
        transition: transform 0.2s ease;
      }

      &:hover::after {
        transform: translateX(10px);
      }
    }
  }
}

.reply-mobile {
  font-size: 18px;
  display: none;
  margin-left: 20px;
  color: var(--yzforum-font-color-3);
  align-items: center;

  span {
    color: var(--yzforum-blue-5);
    margin-left: 10px;

    &::after {
      content: '➢';
      color: var(--yzforum-red-4);
      margin-left: 10px;
    }
  }
}

.comment {
  @include yz-center;
  font-size: 24px;
  color: var(--yzforum-font-color-2);
  cursor: pointer;
  margin-right: 17px;
}

.active-upvote .container {
  border: 2px solid var(--yzforum-red-4);
}

.active {
  box-shadow: 0 0 0 2px var(--yzforum-red-4) inset;
  border-radius: 10px;
  background-color: var(--yzforum-trans-blue-0);
}

@media (max-width: 1000px) {
  .top {
    flex-direction: column;
  }

  .bottom {
    flex-direction: column;
  }
}

@media (max-width: 700px) {
  .reply {
    margin-bottom: 7px;
  }

  .other-topic-container {
    min-height: initial;
  }

  .article {
    flex-direction: column;
  }

  .reply-to {
    display: none !important;
  }

  .icon {
    font-size: initial;
  }

  .reply-mobile {
    display: flex;
  }
}
</style>