<script setup lang="ts">
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{
  tid?: number
  rid?: number
  toUid: number
  upvoteCount: number
  isUpvoted: boolean
}>()

const userStore = usePersistUserStore()
const isUpvoted = ref(props.isUpvoted)
const upvoteCount = ref(props.upvoteCount)

async function upvoteTopic() {
  const res = await useComponentMessageStore().alert(
      {
        'en-us': 'Are you sure you want to upvote this topic?',
        'ja-jp': 'このトピックを推しますか？',
        'zh-cn': '您确定推这个话题吗?',
      },
      {
        'en-us':
            'Upvote a topic will consume 7 Points from you and give the recipient 3 Points.',
        'ja-jp': 'トピックを推すと、7ポイントが消費され、相手には3ポイントが加算されます。',
        'zh-cn': '推话题将会消耗您 7 柚子点, 并给被推者增加 3 柚子点。',
      }
  )
  if (!res) {
    return
  }

  const result = await $fetch(`/api/topic/${props.tid}/upvote`, {
    method: 'PUT',
    watch: false,
    ...yzforumResponseHandler
  })
  if (result) {
    upvoteCount.value++
    isUpvoted.value = true
    useMessage(InfoCode.TopicUpvoteSuccess, 'success')
  }
}

async function upvoteReply() {
  const res = await useComponentMessageStore().alert(
      {
        'en-us': 'Are you sure you want to upvote this reply?',
        'ja-jp': 'この返信を推しますか？',
        'zh-cn': '您确定推这个回复吗?'
      },
      {
        'en-us':
            'Upvote a reply will consume 2 Points from you and give the recipient 1 Points.',
        'ja-jp':
            '返信を推すと、2ポイントが消費され、相手には1ポイントが加算されます。',
        'zh-cn': '推回复将会消耗您 2 柚子点, 并给被推者增加 1 柚子点。'
      }
  )
  if (!res) {
    return
  }

  const result = await $fetch(`/api/topic/${props.tid}/reply/upvote`, {
    method: 'PUT',
    query: {rid: props.rid},
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    upvoteCount.value++
    isUpvoted.value = true
    useMessage(InfoCode.ReplyUpvoteSuccess, 'success')
  }
}

async function handleClickUpvote() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToUpvote, 'warn', 5000)
    return
  }

  if (userStore.uid === props.toUid) {
    useMessage(InfoCode.SelfUpvoteDisallowed, 'warn')
    return
  }

  if (userStore.point < 1100) {
    useMessage(InfoCode.InsufficientPoints, 'warn')
    return
  }

  if (props.rid) {
    await upvoteReply()
  } else {
    await upvoteTopic()
  }
}

</script>

<template>
  <span class="upvote" :class="isUpvoted ? 'active' : ''" @click="handleClickUpvote">
    <Icon class="icon" name="lucide:sparkles"></Icon>
    <span v-if="upvoteCount">{{ upvoteCount }}</span>
  </span>
</template>

<style scoped lang="scss">
.upvote {
  @include yz-center;
  margin-right: 0;
  color: var(--yzforum-font-color-2);

  .icon {
    cursor: pointer;
    font-size: 24px;
    margin-right: 3px;
  }
}

.active .icon {
  color: var(--yzforum-red-4);
}

@media (max-width: 700px) {
  .upvote {
    .icon {
      font-size: initial;
    }
  }
}
</style>