<script lang="ts" setup>
import type {GameResourceDetails} from "~/types/api/gameResource";
import {InfoCode} from "~/code&message/infoCode";

const {locale, t} = useI18n()

const userStore = usePersistUserStore()
const gameResourceStore = useTempGameResourceStore()

const props = defineProps<{ details: GameResourceDetails, refresh: () => Promise<unknown> }>()

const isFetching = ref(false)

async function handleDeleteResource(gid: number, grid: number) {
  const res = await useComponentMessageStore().alert(
      {
        'en-us': 'Are you sure you want to delete the game resource link?',
        'ja-jp': 'ゲームのリソースリンクを削除してもよろしいですか？',
        'zh-cn': '您确定删除游戏资源链接吗？'
      },
      {
        'en-us': 'This action will deduct 5 Points that you earned from publishing the game resource, and it will also negate the impact of likes from other users on the resource link (reducing both Points and likes count by one). This action cannot be undone.',
        'ja-jp': 'この操作により、ゲームリソースの公開で獲得した5ポイントが差し引かれ、他のユーザーからの「いいね」の影響も無効になります（ポイントと「いいね」の数が1つ減ります）。この操作は元に戻せません。',
        'zh-cn': '这将会扣除您发布游戏资源获得的 5 柚子点，并且扣除其它人对资源链接的点赞影响（柚子点和点赞数减一），此操作不可撤销。'
      }
  )
  if (!res) {
    return
  }

  const result = await $fetch(`/api/game/${gid}/resource`, {
    method: 'DELETE',
    query: {grid},
    watch: false,
    ...yzforumResponseHandler
  })

  if (result) {
    await props.refresh()
  }
}

async function handleReportExpire(details: GameResourceDetails) {
  if (!userStore.uid) {
    useMessage(InfoCode.LoginToReport, 'warn')
    return
  }

  const res = await useComponentMessageStore().alert(
      {
        'en-us': 'Are you sure you want to report the resource link expired?',
        'ja-jp': 'リソースリンクの期限切れを報告しますか？',
        'zh-cn': '您确定报告资源链接失效吗？'
      },
      {
        'en-us': "This will notify the resource publisher of the link's expiration and mark the link as invalid. If the resource publisher does not replace the link with a valid one within 17 days, the resource link will be deleted. Maliciously reporting expiration will result in punishment.",
        'ja-jp': 'これにより、リソースの公開者にリンクの期限切れが通知され、リンクが無効としてマークされます。リソース公開者が17日以内に有効なリンクに置き換えない場合、そのリンクは削除されます。悪意のある期限切れ報告は罰則を受けます。',
        'zh-cn': '这将会通知资源发布者链接失效, 并将该链接标记为失效。若 17 天内资源发布者没有更换有效链接，该资源链接将会被删除。若恶意报告失效, 将会被处罚。',
      }
  )
  if (!res) {
    return
  }

  isFetching.value = true
  const result = await $fetch(`/api/game/${details.gid}/resource/expired`, {
    method: 'PUT',
    query: {grid: details.grid},
    watch: false,
    ...yzforumResponseHandler
  })
  isFetching.value = false

  if (result) {
    useMessage(InfoCode.ReportInvalidSuccess, 'success')
    await props.refresh()
  }
}

function handleRewriteResource(details: GameResourceDetails) {
  gameResourceStore.resources[0] = {...details}
  gameResourceStore.rewriteResourceId = details.grid
}
</script>

<template>
  <div v-if="details" class="more">
    <div class="title">
      <span v-for="(link, index) in details.link" :key="index" class="link">
        <YuzuCopy :text="link"></YuzuCopy>
        <a :href="link" rel="noopener noreferrer" target="_blank">
          <Icon class="icon" name="lucide:external-link"></Icon>
        </a>
      </span>

      <div class="password">
        <span v-if="details.code">
          <span>{{ t('game.resource.extract') }}: </span>
          <YuzuCopy :text="details.code"></YuzuCopy>
        </span>
        <span v-if="details.password">
          <span>{{ t('game.resource.decompress') }}: </span>
          <YuzuCopy :text="details.password"></YuzuCopy>
        </span>
      </div>
    </div>

    <pre class="note">{{ details.note }}</pre>

    <div class="user">
      <div class="user-info">
        <YuzuAvatar :user="details.user" size="35px"></YuzuAvatar>
        <span class="username">{{ details.user.name }}</span>
        <span class="time">{{ formatTimeDiff(details.time, locale) }}</span>
      </div>

      <div v-if="details.user.uid === userStore.uid" class="user-button">
        <span class="rewrite" @click="handleRewriteResource(details)">
          <Icon class="icon" name="lucide:pencil"></Icon>
        </span>
        <span class="delete" @click="handleDeleteResource(details.gid, details.grid)">
          <Icon class="icon" name="lucide:trash-2"></Icon>
        </span>
      </div>

      <div v-if="userStore.uid !== details.user.uid && !details.status" class="other-button">
        <YuzuButton :pending="isFetching" type="danger" @click="handleReportExpire(details)">
          {{ t('game.resource.expire') }}
        </YuzuButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.more {
  margin-bottom: 10px;
}

.title {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .link {
    cursor: pointer;
    margin-bottom: 10px;

    & > a {
      margin-left: 10px;
      font-size: 20px;
      color: var(--yzforum-font-color-0);

      &:hover {
        color: var(--yzforum-blue-5);
      }
    }
  }

  .password {
    margin-bottom: 10px;

    & > span {
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.note {
  margin: 0 0 10px;
  border-left: 5px solid var(--yzforum-blue-5);
  padding-left: 10px;
  white-space: pre-wrap;
  word-break: break-all;
}

.user {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .user-info {
    display: flex;
    align-items: center;

    .username {
      margin: 0 10px;
    }

    .time {
      font-size: small;
    }
  }

  .user-button {
    font-size: 18px;

    span {
      cursor: pointer;

      &:first-child {
        margin-right: 20px;
      }

      &:last-child {
        color: var(--yzforum-red-5);
      }
    }
  }
}
</style>