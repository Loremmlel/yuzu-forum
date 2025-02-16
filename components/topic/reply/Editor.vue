<script lang="ts" setup>
import {MilkdownProvider} from "@milkdown/vue";
import {ProsemirrorAdapterProvider} from "@prosemirror-adapter/vue";

const props = defineProps<{ showMenu: boolean }>()

const tempReplyStore = useTempReplyStore()
const persistReplyStore = usePersistYzforumReplyStore()

const textarea = ref<HTMLTextAreaElement | null>(null)

const valueMarkdown = ref(tempReplyStore.isReplyRewriting
    ? tempReplyStore.replyRewrite[0].markdown
    : persistReplyStore.replyDraft.content)

function autoResizeTextarea() {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

function saveMarkdown(editorMarkdown: string) {
  if (tempReplyStore.isReplyRewriting) {
    tempReplyStore.replyRewrite[0].markdown = editorMarkdown
  } else {
    persistReplyStore.replyDraft.content = editorMarkdown
  }
  valueMarkdown.value = editorMarkdown
}

function handleInputCodeMarkdown(event: Event) {
  const target = event.target as HTMLTextAreaElement
  autoResizeTextarea()
  saveMarkdown(target.value)
}

onMounted(() => autoResizeTextarea())

watch(
    () => persistReplyStore.mode,
    async () => {
      await nextTick()
      if (persistReplyStore.mode === 'code') {
        autoResizeTextarea()
      }
    }
)
</script>

<template>
  <div class="editor">
    <MilkdownProvider v-if="persistReplyStore.mode === 'preview'">
      <ProsemirrorAdapterProvider>
        <YuzuMilkdownEditor :is-show-menu="showMenu" :value-markdown="valueMarkdown"
                            editor-height="200" @save-markdown="saveMarkdown"></YuzuMilkdownEditor>
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>

    <div v-else class="code-editor">
      <YuzuMilkdownPluginsModeToggle></YuzuMilkdownPluginsModeToggle>
      <textarea ref="textarea" :value="valueMarkdown" autofocus class="code"
                maxlength="100000" @input="handleInputCodeMarkdown($event)">
      </textarea>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-editor {
  textarea {
    border: none;
    width: 100%;
    height: 100%;
    min-height: 200px;
    background-color: transparent;
    font-size: 16px;
    font-family: inherit;
    color: var(--yzforum-font-color-2);
    padding: 10px;
    resize: none;
  }
}
</style>