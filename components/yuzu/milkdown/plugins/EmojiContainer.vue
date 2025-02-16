<script lang="ts" setup>
import type {UseEditorReturn} from "@milkdown/vue";
import {editorViewCtx} from "@milkdown/core";
import {emojis} from "~/components/yuzu/milkdown/plugins/isoEmojis";

const props = defineProps<{
  editorInfo: UseEditorReturn
}>()

const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(emojis.length / 49))

const paginatedEmojis = computed(() => {
  const start = (currentPage.value - 1) * 49
  return emojis.slice(start, start + 49)
})

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function selectEmoji(emoji: string) {
  props.editorInfo.get()?.action((ctx) => {
    const view = ctx.get(editorViewCtx)
    const {state} = view
    const {tr} = state
    view.dispatch(tr.insertText(emoji, state.selection.from))
  })
}
</script>

<template>
  <div class="emoji-container">
    <div class="emoji-grid">
      <span v-for="(emoji, index) in paginatedEmojis" :key="index" class="emoji" @click="selectEmoji(emoji)">
        {{ emoji }}
      </span>
    </div>

    <div class="pagination">
      <span class="prev" @click="prevPage">
        <Icon class="icon" name="lucide:chevron-left"></Icon>
      </span>

      <span class="next" @click="nextPage">
        <Icon class="icon" name="lucide:chevron-right"></Icon>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.emoji-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 32px;
  @include yz-blur;
  padding: 8px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  span {
    padding: 2px;
    cursor: pointer;
    text-align: center;
    border-radius: 4px;

    &:hover {
      background-color: var(--yzforum-trans-blue-2);
    }
  }
}

.pagination {
  display: flex;
  align-items: center;
  margin: 10px 0;

  & > span {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 10px;
    box-shadow: var(--shadow);
    color: var(--yzforum-font-color-3);
    transition: all 0.2s;
    @include yz-center;

    &:first-child {
      margin-right: 8px;
    }

    &:hover {
      color: var(--yzforum-blue-5);
      background-color: var(--yzforum-trans-blue-0);
    }
  }
}
</style>