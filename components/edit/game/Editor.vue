<script lang="ts" setup>
import {MilkdownProvider} from "@milkdown/vue";
import {ProsemirrorAdapterProvider} from "@prosemirror-adapter/vue";

const props = defineProps<{
  lang: Language
  type: 'publish' | 'rewrite'
  pending?: boolean
}>()

const editGameStore = usePersistEditGameStore()
const tempGamePRStore = useTempGamePRStore()

const valueMarkdown = computed(() => {
  if (props.type === 'publish') {
    return editGameStore.introduction[props.lang]
  } else {
    return tempGamePRStore.gamePR[0].introduction[props.lang]
  }
})

const saveMarkdown = debounce((editorMarkdown: string) => {
  if (props.type === 'publish') {
    editGameStore.introduction[props.lang] = editorMarkdown
  } else {
    tempGamePRStore.gamePR[0].introduction[props.lang] = editorMarkdown
  }
}, 100)
</script>

<template>
  <div>
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <YuzuMilkdownNoImage :language="lang" :pending="pending"
                             :value-markdown="valueMarkdown" @save-markdown="saveMarkdown"></YuzuMilkdownNoImage>
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  </div>
</template>

<style lang="scss" scoped>

</style>