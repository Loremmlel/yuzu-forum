<script lang="ts" setup>
const {t} = useI18n()
const props = defineProps<{
  show: boolean
}>()
const emits = defineEmits<{
  insert: [href: string, text: string]
  cancel: []
}>()
const inputHref = ref('')
const inputText = ref('')
const exampleURL = useRuntimeConfig().public.YZFORUM_URL

watch(
    () => props.show,
    () => {
      inputHref.value = ''
      inputText.value = ''
    }
)

function handleLinkInsert() {
  if (inputHref.value.length === 0) {
    return
  }
  const text = inputText.value.length === 0 ? inputHref.value : inputText.value
  emits('insert', inputHref.value, text)
}
</script>

<template>
  <YuzuDialog :show-dialog="show">
    <div class="container">
      <h2 class="title">{{ t('edit.topic.link.title') }}</h2>
      <YuzuInput v-model="inputHref" :placeholder="`${t('edit.topic.link.URLLabel')} (${exampleURL})`" class="input"
                 type="url"></YuzuInput>
      <YuzuInput v-model="inputText" :placeholder="t('edit.topic.link.textLabel')" class="input"
                 type="text"></YuzuInput>
      <div class="button-group">
        <YuzuButton @click="emits('cancel')">{{ t('edit.topic.link.cancelInsert') }}</YuzuButton>
        <YuzuButton @click="handleLinkInsert">{{ t('edit.topic.link.confirmInsert') }}</YuzuButton>
      </div>
    </div>
  </YuzuDialog>
</template>

<style lang="scss" scoped>
.container {
  width: 600px;
  margin: auto;
  padding: 20px;
  background-color: var(--yzforum-white);
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  h2 {
    margin-bottom: 20px;
  }

  input {
    margin-bottom: 20px;
  }
}

.button-group {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: row;

  button {
    &:last-child {
      margin-left: 10px;
    }
  }
}

@media (max-width: 700px) {
  .container {
    margin: auto 20px;
  }
}
</style>