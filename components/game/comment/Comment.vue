<script setup lang="ts">
import type {GameComment} from "~/types/api/gameComment";
import type {GameDetail} from "~/types/api/game";
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{
  comment: GameComment
  refresh: () => Promise<void>
}>()

const game = inject<GameDetail>('game')

const gameResourceStore = useTempGameResourceStore()
const { uid, roles } = usePersistUserStore()
const { locale, t } = useI18n()

const showComment = ref(false)
const showDelete = computed(() => props.comment.user?.uid === uid || game?.user.uid === uid || roles >= 2)

function handleClickComment(uid: number) {
  showComment.value = !showComment.value
  gameResourceStore.commentToUid = uid
}

const handleDeleteComment = async (gid: number, gcid: number) => {
  const res = await useComponentMessageStore().alert({
    'en-us': 'Are you sure you want to delete the comment?',
    'ja-jp': 'コメントを削除してもよろしいですか？',
    'zh-cn': '您确定删除评论吗？'
  })
  if (!res) {
    return
  }

  const result = await $fetch(`/api/game/${gid}/comment`, {
    method: 'DELETE',
    query: { gcid },
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    useMessage(InfoCode.CommentDeleteSuccess, 'success')
    await props.refresh()
  }
}
</script>

<template>
  <div class="comment">
    <div class="info">
      <div class="user">
        <YuzuAvatar :user="comment.user" size="30px"></YuzuAvatar>
        <span>{{ comment.user.name }}</span>
        <span class="time">
          {{ formatTimeDiff(comment.time, locale) }}
        </span>

        <div v-if="comment.toUser">
          <span>=> </span>
          <NuxtLink :to="`/yzgamer/${comment.toUser.uid}/info`">
            {{ `${comment.toUser.name}` }}
          </NuxtLink>
        </div>
      </div>

      <div class="action">
        <span class="reply" @click="handleClickComment(comment.user.uid)">
          <Icon class="icon" name="lucide:reply"></Icon>
        </span>
        <GameCommentLike :comment="comment"></GameCommentLike>
        <span class="delete" v-if="showDelete" @click="handleDeleteComment(comment.gid, comment.gcid)">
          <Icon class="icon" name="lucide:trash-2"></Icon>
        </span>
      </div>
    </div>

    <pre class="content">{{ comment.content }}</pre>

    <GameCommentPanel v-if="showComment" :refresh="refresh" @close="showComment = false"></GameCommentPanel>
  </div>
</template>

<style scoped lang="scss">
.comment {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;

  .user {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    a {
      margin-right: 30px;
      color: var(--yzforum-blue-5);
    }

    .yuzu-avatar {
      margin-right: 10px;
    }

    .time {
      font-size: small;
      margin: 0 10px;
      color: var(--yzforum-font-color-0);
    }
  }

  .action {
    margin-left: auto;
    display: flex;
    align-items: center;
    color: var(--yzforum-font-color-2);

    .reply {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: var(--yzforum-blue-5);
      font-size: 20px;
      margin-right: 10px;
    }

    .delete {
      cursor: pointer;
      margin-left: 5px;
      margin-bottom: 3px;
      color: var(--yzforum-red-5);
    }
  }
}

.content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.panel {
  margin-top: 10px;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>