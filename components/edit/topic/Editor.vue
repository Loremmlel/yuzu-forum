<script setup lang="ts">
import {MilkdownProvider} from "@milkdown/vue";
import {ProsemirrorAdapterProvider} from "@prosemirror-adapter/vue";

const tempEdit = useTempEditStore()
const persistEdit = usePersistEditTopicStore()

const textarea = ref<HTMLTextAreaElement | null>(null)

const valueMarkdown = ref(tempEdit.isTopicRewriting ? tempEdit.content : persistEdit.content)

function autoResizeTextarea() {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

function saveMarkdown(editorMarkdown: string) {
  const targetContent = tempEdit.isTopicRewriting ? tempEdit.content : persistEdit.content
  // 编辑器内容发生变化时，更新对应的数据
  // 原仓库没有更新，也是奇了怪了
  if (targetContent !== editorMarkdown) {
    if (tempEdit.isTopicRewriting) {
      tempEdit.content = editorMarkdown
    } else {
      persistEdit.content = editorMarkdown
    }
  }
  valueMarkdown.value = editorMarkdown
  tempEdit.autosaveCount++
}

function handleInputCodeMarkdown(event: Event) {
  const target = event.target as HTMLTextAreaElement
  autoResizeTextarea()
  saveMarkdown(target.value)
}

onMounted(() => autoResizeTextarea())

watch(
    () => persistEdit.mode,
    async () => {
      await nextTick()
      if (persistEdit.mode === 'code') {
        autoResizeTextarea()
      }
    }
)
</script>

<template>
  <div class="editor">
    <MilkdownProvider v-if="persistEdit.mode === 'preview'">
      <ProsemirrorAdapterProvider>
        <YuzuMilkdownEditor @save-markdown="saveMarkdown" :value-markdown="valueMarkdown" editor-height="300"
                            :is-show-menu="true">
        </YuzuMilkdownEditor>
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
    <div class="code-editor" v-if="persistEdit.mode === 'code'">
      <YuzuMilkdownPluginsModeToggle></YuzuMilkdownPluginsModeToggle>
      <textarea class="code" maxlength="100000" :value="valueMarkdown"
                @input="handleInputCodeMarkdown($event)" ref="textarea" autofocus></textarea>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-editor {
  textarea {
    border: none;
    width: 100%;
    height: 100%;
    min-height: 300px;
    background-color: transparent;
    font-size: 16px;
    font-family: inherit;
    color: var(--yzforum-font-color-2);
    padding: 10px;
    resize: none;
  }
}
</style>