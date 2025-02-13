<script setup lang="ts">
import 'animate.css'

const {t} = useI18n()

const persistTopicStore = usePersistYzforumTopicStore()
const tempReplyStore = useTempReplyStore()
const persistReplyStore = usePersistYzforumReplyStore()

const position = computed(() => persistReplyStore.replyDraft.toFloor === 0 ? 'master' : 'reply')

async function handleClosePanel() {
  if (tempReplyStore.isReplyRewriting) {
    const res = await useComponentMessageStore().alert({
      'en-us': 'Confirm closing the panel? Your changes will not be saved.',
      'ja-jp': 'パネルを閉じてもよろしいですか？変更は保存されません。',
      'zh-cn': '确认关闭面板吗？您的更改将不会被保存。'
    })
    if (res) {
      tempReplyStore.resetRewriteReplyData()
    } else {
      return
    }
  }
  persistTopicStore.showAdvance = false
  tempReplyStore.isEdit = false
}
</script>

<template>
  <Teleport to="body" :disabled="!tempReplyStore.isEdit">
    <Transition
        enter-active-class="animate__animated animate__fadeInUp animate__faster"
        leave-active-class="animate__animated animate__fadeOutDown animate__faster">
      <div class="root" v-if="tempReplyStore.isEdit">
        <div class="container">
          <div class="title">
            <h3>
              <span>{{ t('topic.panel.to') + ' @' }}</span>
              <span class="username">{{ persistReplyStore.replyDraft.toUsername }}</span>
              <span>
                <span class="emoji">>(⋈◍＞◡＜◍)。✧♡ </span>
                {{ `${t(`topic.panel.${position}`)} ${persistReplyStore.replyDraft.toFloor}` }}
              </span>
            </h3>
            <span class="close">
              <Icon class="icon" @click="handleClosePanel" name="lucide:x"></Icon>
            </span>
          </div>

          <div class="content">
            <LazyTopicReplyEditor :show-menu="persistTopicStore.showAdvance"></LazyTopicReplyEditor>
          </div>

          <div class="footer">
            <LazyEditTopicTags style="margin-top: 10px; padding: 10px"
                               v-if="persistTopicStore.showAdvance"></LazyEditTopicTags>
            <TopicReplyPanelButton></TopicReplyPanelButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.root {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.container {
  transition: all 0.2s;
  width: 90%;
  max-width: 60rem;
  max-height: 80vh;
  overflow-y: scroll;
  @include yz-blur;

  .close {
    font-size: 30px;
    cursor: pointer;
    color: var(--yzforum-font-color-1);
  }
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 10px 20px;

  span {
    user-select: none;

    &:nth-child(3) {
      margin-left: 10px;
    }

    .emoji {
      color: var(--yzforum-pink-3);
    }
  }

  .username {
    margin: 0 5px;
    cursor: pointer;
    color: var(--yzforum-blue-5);
    border-bottom: 2px solid var(--yzforum-white-9);

    &:hover {
      border-bottom: 2px solid var(--yzforum-blue-5);
    }
  }
}

@media (max-width: 700px) {
  .emoji {
    display: none;
  }
}
</style>