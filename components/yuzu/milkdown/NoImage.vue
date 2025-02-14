<script setup lang="ts">
import {tooltipFactory} from "@milkdown/plugin-tooltip";
import {usePluginViewFactory} from "@prosemirror-adapter/vue";
import {Milkdown, useEditor} from "@milkdown/vue";
import {defaultValueCtx, Editor, rootAttrsCtx, rootCtx} from "@milkdown/core";
import {listener, listenerCtx} from "@milkdown/plugin-listener";
import {prism, prismConfig} from "@milkdown/plugin-prism";
import {history} from '@milkdown/plugin-history'
import {Plugin} from '@milkdown/prose/state'
import bash from 'refractor/lang/bash'
import c from 'refractor/lang/c'
import cpp from 'refractor/lang/cpp'
import csharp from 'refractor/lang/csharp'
import css from 'refractor/lang/css'
import go from 'refractor/lang/go'
import haskell from 'refractor/lang/haskell'
import python from 'refractor/lang/python'
import java from 'refractor/lang/java'
import javascript from 'refractor/lang/javascript'
import jsx from 'refractor/lang/jsx'
import json from 'refractor/lang/json'
import kotlin from 'refractor/lang/kotlin'
import r from 'refractor/lang/r'
import rust from 'refractor/lang/rust'
import scala from 'refractor/lang/scala'
import sql from 'refractor/lang/sql'
import tsx from 'refractor/lang/tsx'
import typescript from 'refractor/lang/typescript'
import markdown from 'refractor/lang/markdown'
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

    <div class="loading" v-if="editorInfo.loading.value">
      <Icon class="icon" name="svg-spinners:12-dots-scale-rotate"></Icon>
      <span>{{ t('edit.topic.loading') }}</span>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/css/editor/yuzu-content.scss';
</style>

<style scoped lang="scss">
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