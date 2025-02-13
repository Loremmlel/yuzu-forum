<script setup lang="ts">
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
    <div class="button" aria-label="yzforum-bold" @click="call(toggleStrongCommand.key)" v-tooltip="{
      message: {
          'en-us': 'Bold',
          'ja-jp': '太字',
          'zh-cn': '加粗'
        },
        position: 'bottom'
    }">
      <Icon class="icon" name="lucide:bold"></Icon>
    </div>
    <div class="button" aria-label="yzforum-italic" @click="call(toggleEmphasisCommand.key)" v-tooltip="{
        message: {
          'en-us': 'Italic',
          'ja-jp': '斜体',
          'zh-cn': '斜体'
        },
        position: 'bottom'
      }">
      <Icon class="icon" name="lucide:italic"></Icon>
    </div>

    <div class="button" aria-label="yzforum-strikethrough" @click="call(toggleStrikethroughCommand.key)" v-tooltip="{
        message: {
          'en-us': 'Strikethrough',
          'ja-jp': '打消し線',
          'zh-cn': '删除线'
        },
        position: 'bottom'
      }">
      <Icon class="icon" name="lucide:strikethrough"></Icon>
    </div>

    <div class="button" aria-label="yzforum-list-bulleted" @click="call(wrapInBulletListCommand.key)" v-tooltip="{
        message: {
          'en-us': 'Bulleted List',
          'ja-jp': '箇条書き',
          'zh-cn': '无序列表',
          'zh-tw': '無序列錶'
        },
        position: 'bottom'
      }">
      <Icon class="icon" name="lucide:list"></Icon>
    </div>

    <div class="button" aria-label="yzforum-list-numbered" @click="call(wrapInOrderedListCommand.key)" v-tooltip="{
        message: {
          'en-us': 'Ordered List',
          'ja-jp': '番号付きリスト',
          'zh-cn': '有序列表',
          'zh-tw': '有序列錶'
        },
        position: 'bottom'
      }">
      <Icon class="icon" name="lucide:list-ordered"></Icon>
    </div>

    <div class="button" aria-label="yzforum-quote" @click="call(wrapInBlockquoteCommand.key)" v-tooltip="{
        message: {
          'en-us': 'Quote Block',
          'ja-jp': '引用ブロック',
          'zh-cn': '引用块'
        },
        position: 'bottom'
      }">
      <Icon class="icon" name="lucide:quote"></Icon>
    </div>

    <div class="button" aria-label="yzforum-horizontal" @click="call(insertHrCommand.key)" v-tooltip="{
        message: {
          'en-us': 'Horizontal Line',
          'ja-jp': '水平線',
          'zh-cn': '水平线'
        },
        position: 'bottom'
      }">
      <Icon class="icon" name="lucide:minus"></Icon>
    </div>

    <div class="button" aria-label="yzforum-insert-link" @click="showInsertLink = true" v-tooltip="{
      message: {
          'en-us': 'Insert Link',
          'ja-jp': 'リンク挿入',
          'zh-cn': '插入链接'
        },
        position: 'bottom'
    }">
      <Icon class="icon" name="lucide:link"></Icon>
      <YuzuMilkdownPluginsLinkInsertDialog :show="showInsertLink" @insert="call(
          insertLinkPlugin.key, undefined, () => showInsertLink = false)"
                                           @cancel="showInsertLink = false"></YuzuMilkdownPluginsLinkInsertDialog>
    </div>

    <div class="button" aria-label="yzforum-code-block" @click="call(createCodeBlockCommand.key, 'javascript')"
         v-tooltip="{
      message: {
          'en-us': 'Code Block',
          'ja-jp': 'コードブロック',
          'zh-cn': '代码块',
        },
        position: 'bottom'
    }">
      <Icon class="icon" name="lucide:square-code"></Icon>
    </div>

    <div class="button" aria-label="yzforum-code" @click="call(toggleInlineCodeCommand.key)" v-tooltip="{
        message: {
          'en-us': 'Inline Code',
          'ja-jp': 'インラインコード',
          'zh-cn': '行内代码',
          'zh-tw': '行內代碼'
        },
        position: 'bottom'
      }">
      <Icon class="icon" name="lucide:code-xml"></Icon>
    </div>

    <div class="button" aria-label="yzforum-upload-image" v-if="props.showUploadImage" @click="input?.click()"
         v-tooltip="{
        message: {
          'en-us': 'Upload Image',
          'ja-jp': '画像アップロード',
          'zh-cn': '上传图片',
          'zh-tw': '上傳圖片'
        },
        position: 'bottom'
      }">
      <Icon class="icon" name="lucide:image-plus"></Icon>
      <input ref="input" type="file" accept=".jpg, .jpeg, .png, .webp" @change="handleFileChange($event)">
    </div>

    <div class="button emoji" aria-label="yzforum-emoji">
      <Icon class="icon" name="lucide:smile-plus"></Icon>
      <YuzuMilkdownPluginsEmojiContainer :editor-info="editorInfo"></YuzuMilkdownPluginsEmojiContainer>
    </div>
  </div>
</template>

<style scoped lang="scss">
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