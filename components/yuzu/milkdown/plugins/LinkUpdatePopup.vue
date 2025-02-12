<script setup lang="ts">
import {usePluginViewContext} from "@prosemirror-adapter/vue";
import {useInstance} from "@milkdown/vue";
import type {VNodeRef} from "vue";
import {TooltipProvider} from "@milkdown/plugin-tooltip";
import {linkSchema, updateLinkCommand} from "@milkdown/preset-commonmark";
import {TextSelection} from "prosemirror-state";
import {callCommand} from "@milkdown/utils";

const {t} = useI18n()

const {view, prevState} = usePluginViewContext()

const linkHref = ref('')
const hide = ref(true)
const [loading, get] = useInstance()

const linkUpdatePopupRef = ref<VNodeRef>()
let tooltipProvider: TooltipProvider

onMounted(() => {
  const ctx = useTempEditStore().editorContext
  if (!ctx) {
    return
  }
  tooltipProvider = new TooltipProvider({
    content: linkUpdatePopupRef.value as unknown as HTMLElement,
    debounce: 50,
    shouldShow: (view, _) => {
      if (!view.hasFocus() || !view.editable) {
        return false
      }
      const {selection, doc} = view.state
      const {from, to} = selection

      const linkMarkType = linkSchema.type(ctx)
      if (selection instanceof TextSelection &&
          to < doc.content.size &&
          from < doc.content.size &&
          doc.rangeHasMark(from, from === to ? to + 1 : to, linkMarkType)) {
        const cursor = selection.$cursor
        if (!cursor) {
          return false
        }
        const linkMark = doc.nodeAt(cursor.pos)?.marks.find(mark => mark.type === linkMarkType)
        if (!linkMark) {
          return false
        }
        linkHref.value = linkMark.attrs.href
        hide.value = false
        return selection.empty
      }
      return false
    }
  })
  tooltipProvider.update(view.value, prevState.value)
})

watch([view, prevState], () => {
  tooltipProvider?.update(view.value, prevState.value)
})

onUnmounted(() => {
  tooltipProvider.destroy()
})

function handleUpdateLink() {
  get()?.action(callCommand(updateLinkCommand.key, {href: linkHref.value}))
}
</script>

<template>
  <div v-if="view.editable" class="wrapper" ref="linkUpdatePopupRef">
    <input class="input" type="url" @keydown.enter="handleUpdateLink" v-model="linkHref">
    <button class="confirm-button" @click="handleUpdateLink">
      {{t('edit.topic.link.confirmUpdate')}}
    </button>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 350px;
  display: inline-flex;
  position: absolute;
  border: 1px solid var(--yzforum-blue-5);
  background-color: var(--yzforum-white);

  &[data-show='false'] {
    display: none;
  }
}

.input {
  width: 100%;
  border: none;
  padding: 10px;
  background-color: transparent;
}

.confirm-button {
  width: 65px;
  background-color: transparent;
  border: none;
  color: var(--yzforum-blue-5);
  font-size: 15px;
  padding: 0 4px;
  flex-shrink: 0;

  &:hover {
    color: var(--yzforum-white);
    background-color: var(--yzforum-blue-5);
  }
}
</style>