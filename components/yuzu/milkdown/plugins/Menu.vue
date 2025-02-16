<script lang="ts" setup>
import type {UseEditorReturn} from "@milkdown/vue";
import type {CmdKey} from "@milkdown/core";
import {callCommand} from "@milkdown/utils";
import {InfoCode} from "~/code&message/infoCode";
import {
  createCodeBlockCommand,
  insertHrCommand,
  insertImageCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleStrongCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand
} from "@milkdown/preset-commonmark";
import {toggleStrikethroughCommand} from "@milkdown/preset-gfm";
import {insertLinkPlugin} from "~/components/yuzu/milkdown/plugins/hyperlinkInsert";

const props = defineProps<{
  editorInfo: UseEditorReturn,
  showUploadImage: boolean,
  toggle?: boolean
}>()

const {get} = props.editorInfo
const input = ref<HTMLElement>()
const showInsertLink = ref(false)

function call<T, >(command: CmdKey<T>, payload?: T, callback?: () => void) {
  const result = get()?.action(callCommand(command, payload))
  if (callback) {
    callback()
  }
  return result
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) {
    return
  }
  const file = input.files[0]

  const formData = new FormData()
  formData.append('image', file)
  useMessage(InfoCode.UploadInProgress, 'info')
  const result = await $fetch('/api/image/topic', {
    method: 'POST',
    body: formData,
    watch: false,
    ...yzforumResponseHandler
  })
  if (!result) {
    return
  }
  const filename = file.name.replace(/[^a-zA-Z0-9 ]/g, '')
  const username = usePersistUserStore().name
  const imageName = `${username}-${Date.now()}-${filename}`
  call(insertImageCommand.key, {
    src: result ?? '',
    title: imageName,
    alt: imageName
  })
  useMessage(InfoCode.ImageUploadSuccess, 'success')
}
</script>

<template>
  <div class="menu">
    <YuzuMilkdownPluginsModeToggle v-if="props.toggle ?? true"></YuzuMilkdownPluginsModeToggle>

    <!--插件s-->
    <div v-tooltip="{
      message: {
          'en-us': 'Bold',
          'ja-jp': '太字',
          'zh-cn': '加粗'
        },
        position: 'bottom'
    }" aria-label="yzforum-bold" class="button" @click="call(toggleStrongCommand.key)">
      <Icon class="icon" name="lucide:bold"></Icon>
    </div>
    <div v-tooltip="{
        message: {
          'en-us': 'Italic',
          'ja-jp': '斜体',
          'zh-cn': '斜体'
        },
        position: 'bottom'
      }" aria-label="yzforum-italic" class="button" @click="call(toggleEmphasisCommand.key)">
      <Icon class="icon" name="lucide:italic"></Icon>
    </div>

    <div v-tooltip="{
        message: {
          'en-us': 'Strikethrough',
          'ja-jp': '打消し線',
          'zh-cn': '删除线'
        },
        position: 'bottom'
      }" aria-label="yzforum-strikethrough" class="button" @click="call(toggleStrikethroughCommand.key)">
      <Icon class="icon" name="lucide:strikethrough"></Icon>
    </div>

    <div v-tooltip="{
        message: {
          'en-us': 'Bulleted List',
          'ja-jp': '箇条書き',
          'zh-cn': '无序列表',
          'zh-tw': '無序列錶'
        },
        position: 'bottom'
      }" aria-label="yzforum-list-bulleted" class="button" @click="call(wrapInBulletListCommand.key)">
      <Icon class="icon" name="lucide:list"></Icon>
    </div>

    <div v-tooltip="{
        message: {
          'en-us': 'Ordered List',
          'ja-jp': '番号付きリスト',
          'zh-cn': '有序列表',
          'zh-tw': '有序列錶'
        },
        position: 'bottom'
      }" aria-label="yzforum-list-numbered" class="button" @click="call(wrapInOrderedListCommand.key)">
      <Icon class="icon" name="lucide:list-ordered"></Icon>
    </div>

    <div v-tooltip="{
        message: {
          'en-us': 'Quote Block',
          'ja-jp': '引用ブロック',
          'zh-cn': '引用块'
        },
        position: 'bottom'
      }" aria-label="yzforum-quote" class="button" @click="call(wrapInBlockquoteCommand.key)">
      <Icon class="icon" name="lucide:quote"></Icon>
    </div>

    <div v-tooltip="{
        message: {
          'en-us': 'Horizontal Line',
          'ja-jp': '水平線',
          'zh-cn': '水平线'
        },
        position: 'bottom'
      }" aria-label="yzforum-horizontal" class="button" @click="call(insertHrCommand.key)">
      <Icon class="icon" name="lucide:minus"></Icon>
    </div>

    <div v-tooltip="{
      message: {
          'en-us': 'Insert Link',
          'ja-jp': 'リンク挿入',
          'zh-cn': '插入链接'
        },
        position: 'bottom'
    }" aria-label="yzforum-insert-link" class="button" @click="showInsertLink = true">
      <Icon class="icon" name="lucide:link"></Icon>
      <YuzuMilkdownPluginsLinkInsertDialog :show="showInsertLink" @cancel="showInsertLink = false"
                                           @insert="call(
          insertLinkPlugin.key, undefined, () => showInsertLink = false)"></YuzuMilkdownPluginsLinkInsertDialog>
    </div>

    <div v-tooltip="{
      message: {
          'en-us': 'Code Block',
          'ja-jp': 'コードブロック',
          'zh-cn': '代码块',
        },
        position: 'bottom'
    }" aria-label="yzforum-code-block" class="button"
         @click="call(createCodeBlockCommand.key, 'javascript')">
      <Icon class="icon" name="lucide:square-code"></Icon>
    </div>

    <div v-tooltip="{
        message: {
          'en-us': 'Inline Code',
          'ja-jp': 'インラインコード',
          'zh-cn': '行内代码',
          'zh-tw': '行內代碼'
        },
        position: 'bottom'
      }" aria-label="yzforum-code" class="button" @click="call(toggleInlineCodeCommand.key)">
      <Icon class="icon" name="lucide:code-xml"></Icon>
    </div>

    <div v-if="props.showUploadImage" v-tooltip="{
        message: {
          'en-us': 'Upload Image',
          'ja-jp': '画像アップロード',
          'zh-cn': '上传图片',
          'zh-tw': '上傳圖片'
        },
        position: 'bottom'
      }" aria-label="yzforum-upload-image" class="button"
         @click="input?.click()">
      <Icon class="icon" name="lucide:image-plus"></Icon>
      <input ref="input" accept=".jpg, .jpeg, .png, .webp" type="file" @change="handleFileChange($event)">
    </div>

    <div aria-label="yzforum-emoji" class="button emoji">
      <Icon class="icon" name="lucide:smile-plus"></Icon>
      <YuzuMilkdownPluginsEmojiContainer :editor-info="editorInfo"></YuzuMilkdownPluginsEmojiContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  position: sticky;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background-color: var(--yzforum-trans-blue-0);
  backdrop-filter: blur(10px);
  z-index: 999;

  .button {
    cursor: pointer;
    @include yz-center;
    padding: 5px;
    border-radius: 5px;
    margin: 5px;
    font-size: 22px;
    color: var(--yzforum-font-color-3);
    background-color: transparent;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid var(--yzforum-blue-5);
      color: var(--yzforum-blue-5);
    }
  }
}

.emoji {
  position: relative;

  .emoji-container {
    display: none;
  }

  &:hover {
    .emoji-container {
      display: flex;
    }
  }
}

input {
  display: none;
}
</style>