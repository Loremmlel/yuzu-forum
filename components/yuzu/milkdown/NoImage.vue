<script lang="ts" setup>
import {tooltipFactory} from "@milkdown/plugin-tooltip";
import {usePluginViewFactory} from "@prosemirror-adapter/vue";
import {Milkdown, useEditor} from "@milkdown/vue";
import {defaultValueCtx, Editor, rootAttrsCtx, rootCtx} from "@milkdown/core";
import {listener, listenerCtx} from "@milkdown/plugin-listener";
import {prism, prismConfig} from "@milkdown/plugin-prism";
import {history} from '@milkdown/plugin-history'
import {Plugin} from '@milkdown/prose/state'
// fix: 升级依赖后，依赖本身的路径发生了变化，导致打包失败
import bash from 'refractor/bash'
import c from 'refractor/c'
import cpp from 'refractor/cpp'
import csharp from 'refractor/csharp'
import css from 'refractor/css'
import go from 'refractor/go'
import haskell from 'refractor/haskell'
import python from 'refractor/python'
import java from 'refractor/java'
import javascript from 'refractor/javascript'
import jsx from 'refractor/jsx'
import json from 'refractor/json'
import kotlin from 'refractor/kotlin'
import r from 'refractor/r'
import rust from 'refractor/rust'
import scala from 'refractor/scala'
import sql from 'refractor/sql'
import tsx from 'refractor/tsx'
import typescript from 'refractor/typescript'
import markdown from 'refractor/markdown'
import Tooltip from "~/components/yuzu/milkdown/plugins/Tooltip.vue";
import LinkUpdatePopup from "~/components/yuzu/milkdown/plugins/LinkUpdatePopup.vue";
import {commonmark} from "@milkdown/preset-commonmark";
import {gfm} from "@milkdown/preset-gfm";
import {clipboard} from "@milkdown/plugin-clipboard";
import {indent} from "@milkdown/plugin-indent";
import {trailing} from "@milkdown/plugin-trailing";
import {insertLinkPlugin} from "~/components/yuzu/milkdown/plugins/hyperlinkInsert";
import {automd} from "@milkdown/plugin-automd";
import {$prose, replaceAll} from "@milkdown/utils";
import Size from "~/components/yuzu/milkdown/plugins/Size.vue";

const {t} = useI18n()

const props = defineProps<{
  valueMarkdown: string
  language: Language
  pending?: boolean
}>()
const emits = defineEmits<{
  saveMarkdown: [editorMarkdown: string]
}>()

const valueMarkdown = computed(() => props.valueMarkdown)

const tooltip = tooltipFactory('Text')
const linkUpdatePopup = tooltipFactory('linkUpdate')
const pluginViewFactory = usePluginViewFactory()
const container = ref<HTMLElement | null>(null)
const toolbar = ref<HTMLElement | null>(null)
const editorContent = ref('')

const editorInfo = useEditor((root) =>
    Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root)
          ctx.set(rootAttrsCtx, {
            roles: 'yzforum-milkdown-editor',
            'aria-label': 'yzforum-milkdown-editor'
          })
          ctx.set(defaultValueCtx, valueMarkdown.value)

          const listener = ctx.get(listenerCtx)
          listener.markdownUpdated((_, markdown, prevMarkdown) => {
            if (markdown !== prevMarkdown) {
              editorContent.value = markdown
              emits('saveMarkdown', markdown)
            }
          })

          ctx.set(prismConfig.key, {
            configureRefractor: (refractor) => {
              refractor.register(bash)
              refractor.register(c)
              refractor.register(cpp)
              refractor.register(csharp)
              refractor.register(css)
              refractor.register(go)
              refractor.register(haskell)
              refractor.register(python)
              refractor.register(markdown)
              refractor.register(java)
              refractor.register(javascript)
              refractor.register(json)
              refractor.register(jsx)
              refractor.register(kotlin)
              refractor.register(r)
              refractor.register(rust)
              refractor.register(scala)
              refractor.register(sql)
              refractor.register(tsx)
              refractor.register(typescript)
            }
          })

          useTempEditStore().editorContext = ctx

          ctx.set(tooltip.key, {
            view: pluginViewFactory({
              component: Tooltip
            })
          })

          ctx.set(linkUpdatePopup.key, {
            view: pluginViewFactory({
              component: LinkUpdatePopup
            })
          })
        })
        .use(history)
        .use(commonmark)
        .use(gfm)
        .use(prism)
        .use(listener)
        .use(clipboard)
        .use(indent)
        .use(trailing)
        .use(tooltip)
        .use(linkUpdatePopup)
        .use(insertLinkPlugin)
        .use(automd)
        .use($prose(() => new Plugin({
                  view: pluginViewFactory({
                    component: Size,
                    root: () => (container.value ? container.value : root)
                  })
                })
            )
        )
)

watch(
    () => [props.language, props.pending],
    () => {
      editorInfo.get()?.action(replaceAll(valueMarkdown.value))
    }
)
</script>

<template>
  <div ref="container" class="editor-container">
    <YuzuMilkdownPluginsMenu ref="toolbar" :editor-info="editorInfo"
                             :show-upload-image="false" :toggle="false"></YuzuMilkdownPluginsMenu>

    <Milkdown class="yzforum-content"></Milkdown>

    <div v-if="editorInfo.loading.value" class="loading">
      <Icon class="icon" name="svg-spinners:12-dots-scale-rotate"></Icon>
      <span>{{ t('edit.topic.loading') }}</span>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/css/editor/yuzu-content.scss';
</style>

<style lang="scss" scoped>
.yzforum-content {
  position: relative;
  width: 100%;

  :deep(.milkdown) {
    width: 100%;
    padding: 10px;

    * &:not(.katex-html) {
      white-space: pre-wrap;
      word-break: break-word;
    }

    & > div:nth-child(1) {
      transition: all 0.2s;
      margin: 0 auto;
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  span {
    margin-left: 20px;
    font-size: large;
    font-style: oblique;
    color: var(--yzforum-blue-5);

    &:nth-child(1) {
      font-size: 50px;
    }
  }
}
</style>