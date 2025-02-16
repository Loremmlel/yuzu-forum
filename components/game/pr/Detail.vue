<script lang="ts" setup>
import type {GamePRDetails} from "~/types/api/gamePR";
import type {GameDetail} from "~/types/api/game";
import type {GameStoreTemp} from "~/store/types/edit/game";
import {InfoCode} from "~/code&message/infoCode";
import DOMPurify from "isomorphic-dompurify";

const {t} = useI18n()

const props = defineProps<{ details: Partial<GamePRDetails>, refresh: () => void }>()

const game = inject<GameDetail>('game')

const userStore = usePersistUserStore()
const showButton = computed(() => game?.user.uid === userStore.uid || userStore.roles >= 2)
const isFetching = ref(false)
const showReasonInput = ref(false)
const declineInput = ref('')

const diff = computed(() => {
  if (!game || !props.details.game) {
    return []
  }
  return diffGame(game, props.details.game)
})

async function handleDeclineRequest() {
  if (!declineInput.value.trim() || declineInput.value.trim().length > 1007) {
    useMessage(InfoCode.RejectReasonRequired, 'warn')
    return
  }
  const res = await useComponentMessageStore().alert(
      {
        'en-us': 'Are you sure you want to decline the update request?',
        'ja-jp': '更新リクエストを拒否してもよろしいですか？',
        'zh-cn': '您确定拒绝更新请求吗？'
      },
      {
        'en-us': 'This action will not merge this update into the current game information',
        'ja-jp': 'この操作では、この更新は現在のゲーム情報にマージされません。',
        'zh-cn': '这将不会将该更新合并至当前的游戏信息中。'
      }
  )
  if (!res) {
    return
  }

  isFetching.value = true
  const result = await $fetch(`/api/game/${props.details.gid}/pr/decline`, {
    method: 'PUT',
    body: {gprid: props.details.gprid, note: declineInput.value.trim()},
    watch: false,
    ...yzforumResponseHandler
  })
  isFetching.value = false

  if (result) {
    useMessage(InfoCode.UpdateRejectSuccess, 'success')
    props.refresh()
  }
}

async function handleMergeRequest() {
  const res = await useComponentMessageStore().alert(
      {
        'en-us': 'Are you sure you want to merge the update request?',
        'ja-jp': '更新リクエストをマージしてもよろしいですか？',
        'zh-cn': '您确定合并更新请求吗？'
      },
      {
        'en-us': 'This will immediately merge the content from the update request into the current game',
        'ja-jp': 'これにより、更新リクエストの内容が直ちに現在のゲームにマージされます。',
        'zh-cn': '这将会立即将更新请求中的内容合并到当前游戏中。'
      }
  )
  if (!res) {
    return
  }

  isFetching.value = true
  const result = await $fetch(`/api/game/${props.details.gid}/pr/merge`, {
    method: 'PUT',
    body: {gprid: props.details.gprid},
    watch: false,
    ...yzforumResponseHandler
  })
  isFetching.value = false

  if (result) {
    useMessage(InfoCode.UpdateMergeSuccess, 'success')
    props.refresh()
  }
}

interface Diffs {
  name: string
  value: string
}

/**
 * 比较新旧游戏对象差异，生成带格式的差异记录
 *
 * @param oldGame - 原始游戏数据对象（可能包含空字段）
 * @param newGame - 新游戏数据对象（包含临时存储的编辑内容）
 * @returns 差异记录数组，包含属性路径和格式化后的差异值
 *
 * @remark 对嵌套对象进行递归比较，对不同类型的变更进行差异化标记：
 * - 新增属性值用 \<b\> 加粗
 * - 修改属性值使用 diff 对比工具
 * - 未变化的属性用 \<i\> 斜体标记（根据业务需求保留原始值）
 */
function diffGame(oldGame: Partial<GameDetail>, newGame: Partial<GameStoreTemp>) {
  const diffs: Diffs[] = []

  /**
   * 递归比较两个对象的属性差异
   *
   * @param obj1 - 参照对象（通常为旧值）
   * @param obj2 - 对比对象（通常为新值）
   * @param path - 当前属性的层级路径（用于生成带路径的字段名）
   *
   * @implementNote 特殊处理逻辑：
   * 1. 遇到对象类型继续递归比较，保持属性路径连续性
   * 2. 新旧值存在类型差异时，优先按字符串进行对比
   * 3. 对 undefined 值进行显式判断，区分新增字段和修改操作
   */
  function compareObjects(obj1: Record<string, any>, obj2: Record<string, any>, path = '') {
    for (const key in obj1) {
      const newPath = path ? `${path}.${key}` : key

      // 递归处理嵌套对象（仅当两个值都是对象时）
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        compareObjects(obj1[key], obj2[key], newPath)
      } else if (obj1[key] !== obj2[key]) {
        // 处理属性值不同的三种情况
        if (obj1[key] === undefined) {
          // 新增字段：旧值不存在时标记为新增
          diffs.push({
            name: newPath,
            value: `<b>${obj2[key]}</b>`
          })
        } else if (obj2[key] !== undefined && obj1[key] !== undefined) {
          // 值变更：使用 diff 工具生成对比结果
          diffs.push({
            name: newPath,
            value: `${useDiff(obj2[key], obj1[key])}`
          })
        }
      } else if (obj2[key] !== undefined) {
        // 值未变化但仍需记录的字段（如需要显示原始值的场景）
        diffs.push({
          name: newPath,
          value: `<i>${obj2[key]}</i>`
        })
      }
    }
  }

  // 比较前进行数据标准化处理：
  // - 将数组类型字段（如 alias/tags）转换为字符串，确保可比性
  // - 统一新旧数据结构，填充可能为 undefined 的字段
  compareObjects(
      {
        gid: oldGame.gid,
        name: oldGame.name,
        introduction: oldGame.markdown,
        alias: oldGame.alias?.toString(),    // 转换数组为逗号分隔字符串
        official: oldGame.official?.toString(),
        tags: oldGame.tags?.toString(),
        series: oldGame.series?.toString()
      },
      {
        ...newGame,
        alias: newGame.alias?.toString(),    // 保持新旧数据结构一致
        official: newGame.official?.toString(),
        tags: newGame.tags?.toString(),
        series: newGame.series?.toString()
      }
  )

  return diffs
}

</script>

<template>
  <div class="details">
    <div class="diff">
      <div v-for="(yuzu, index) in diff" :key="index">
        <p class="name">{{ t(`game.pr.i18n.${yuzu.name}`) }}</p>
        <div class="value" v-html="DOMPurify.sanitize(yuzu.value.replace(/\\/g, ''))"></div>
      </div>
    </div>

    <div v-if="!details.status && showButton" class="button">
      <YuzuButton :pending="isFetching" @click="showReasonInput = !showReasonInput">
        {{ t('game.pr.decline') }}
      </YuzuButton>
      <YuzuButton :pending="isFetching" @click="handleMergeRequest">
        {{ t('game.pr.merge') }}
      </YuzuButton>
    </div>
    <div v-if="!details.status && !showButton" class="hint">
      {{ t('game.pr.hint') }}
    </div>

    <div v-if="showReasonInput" class="decline-input">
      <YuzuInput v-model="declineInput" :placeholder="`${t('game.pr.note')}`"></YuzuInput>
      <YuzuButton :pending="isFetching" type="danger" @click="handleDeclineRequest">
        {{ t('game.pr.confirm') }}
      </YuzuButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.diff {
  :deep(h2) {
    margin-bottom: 10px;
  }

  :deep(strong) {
    color: var(--yzforum-red-5);
    background-color: var(--yzforum-trans-pink-1);
  }

  :deep(b) {
    color: var(--yzforum-blue-5);
    background-color: var(--yzforum-trans-blue-1);
  }

  :deep(i) {
    color: var(--yzforum-green-4);
  }

  .name {
    margin-bottom: 7px;
    font-weight: bold;
  }

  .value {
    word-break: break-word;
    margin-bottom: 20px;
  }
}

.button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-left: auto;

  .yuzu-button {
    &:first-child {
      margin-right: 20px;
    }
  }
}

.hint {
  font-size: small;
  color: var(--yzforum-font-color-0);
  margin-bottom: 20px;
}

.decline-input {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .yuzu-input {
    width: 100%;
    margin-right: 10px;
  }

  .yuzu-button {
    flex-shrink: 0;
  }
}
</style>