<script setup lang="ts">
import {usePluginViewContext} from "@prosemirror-adapter/vue";

const {t} = useI18n()

const { view } = usePluginViewContext()

const size = computed(() => {
  return view.value.state.doc.textContent.length
})
</script>

<template>
  <div class="footer">
    <span> {{ size + ` ${t('edit.topic.word')}` }} </span>
  </div>
</template>

<style scoped lang="scss">
.footer {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    margin-left: auto;
    font-size: small;
  }
}
</style>