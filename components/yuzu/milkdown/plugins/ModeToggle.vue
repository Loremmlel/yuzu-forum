<script setup lang="ts">
const route = useRoute()
const getRouteBaseName = useRouteBaseName()
const baseRouteName = computed(() => getRouteBaseName(route))

const topic = usePersistEditTopicStore()
const reply = usePersistYzforumReplyStore()

const modeItems = [
  {
    i18n: 'edit.topic.preview',
    value: 'preview'
  },
  {
    i18n: 'edit.topic.code',
    value: 'code'
  }
]

function handleSetMode(value: 'preview' | 'code') {
  if (baseRouteName.value === 'edit-topic') {
    topic.mode = value
  } else {
    reply.mode = value
  }
}
</script>

<template>
  <YuzuNav :items="modeItems" :default-value="baseRouteName === 'edit-topic' ? topic.mode : reply.mode"
  @set="(value) => handleSetMode(value as 'preview' | 'code')" v-tooltip="{
    message: {
        'en-us': 'Text Mode / WYSIWYG mode',
        'ja-jp': 'テキストモード / WYSIWYGモード',
        'zh-cn': '文本模式 / 所见即所得模式',
      },
      position: 'bottom'
  }"></YuzuNav>
</template>

<style scoped lang="scss">
.yuzu-nav {
  display: inline-block;
  height: 45px;
  line-height: 40px;
  vertical-align: middle;
  font-size: 16px;
  margin-left: 16px;
}
</style>