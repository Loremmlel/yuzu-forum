<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const gamePRStore = useTempGamePRStore()

const selectedAlias = ref(gamePRStore.gamePR[0].alias)
const isInputFocus = ref(false)
const inputValue = ref('')
const canDeleteAlias = ref(false)

function handleAliasClose(alias: string) {
  const index = selectedAlias.value.indexOf(alias)
  if (index > -1) {
    selectedAlias.value.splice(index, 1)
  }
}

function handleAddAlias() {
  const aliasName = inputValue.value.trim().slice(0, 17).toLowerCase()
  const isInclude = selectedAlias.value.includes(aliasName)
  if (isInclude) {
    useMessage(InfoCode.DuplicateAlias, 'warn')
    return
  }
  if (aliasName.length > 0 && selectedAlias.value.length < 17) {
    const alias = validateAliasName(aliasName)
    selectedAlias.value.push(alias)
    inputValue.value = ''
    canDeleteAlias.value = true
  }
}

function handleRemoveAlias() {
  if (inputValue.value === '' && selectedAlias.value.length > 0) {
    if (canDeleteAlias.value) {
      selectedAlias.value.pop()
    }
    canDeleteAlias.value = true
  }
}

watch(
    () => selectedAlias.value,
    () => gamePRStore.gamePR[0].alias = selectedAlias.value
)

function validateAliasName(tagName: string) {
  let validatedName = tagName

  if (validatedName.length > 107) {
    validatedName = validatedName.slice(0, 107)
  }

  return validatedName
}
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{ t('edit.pr.alias.name') }}
    </template>
  </YuzuHeader>

  <div class="input-container">
    <div class="alias-container">
      <span v-for="(alias, index) in selectedAlias" :key="index" class="selected-alias">
        {{ alias }}
        <span class="close-button" @click="handleAliasClose(alias)">×</span>
      </span>
    </div>

    <input v-model="inputValue" :placeholder="t('edit.pr.alias.placeholder')" class="input" type="text"
           @blur="isInputFocus = false" @focus="isInputFocus = true"
           @input="canDeleteAlias = false" @keyup.enter="handleAddAlias" @keyup.backspace="handleRemoveAlias">

    <div class="box1"></div>
    <div :class="isInputFocus ? 'box-active' : ''" class="box2"></div>
  </div>

  <div class="hint">{{ t('edit.pr.alias.hint') }}</div>
</template>

<style lang="scss" scoped>
.input-container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.alias-container {
  display: flex;
  flex-wrap: wrap;
}

.selected-alias {
  border: 1px solid var(--yzforum-pink-4);
  border-radius: 15px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
  padding: 3px 20px;
  background-color: var(--yzforum-trans-pink-0);

  span {
    cursor: pointer;
  }
}

.close-button {
  margin: 0 5px;
}

.input {
  background-color: transparent;
  font-size: 18px;
  flex-grow: 1;
  border: none;
  padding: 10px;
  display: flex;
  min-width: 300px;
  color: var(--yzforum-font-color-3);
}

.box1 {
  height: 2px;
  width: 100%;
  display: flex;
  background-color: var(--yzforum-blue-0);
}

.box2 {
  position: relative;
  transform: translateY(-2px);
  transition: all 0.5s;
  height: 2px;
  width: 1px;
  display: flex;
  background-color: var(--yzforum-blue-2);
}

.box-active {
  width: 100%;
  background-color: var(--yzforum-blue-5);
}

.hint {
  font-size: small;
  color: var(--yzforum-font-color-1);
}
</style>