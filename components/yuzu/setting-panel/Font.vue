<script lang="ts" setup>
const {t} = useI18n()
const setting = usePersistSettingsStore()


const font = ref('')

function setFont() {
  if (font.value) {
    setting.setYzforumFontStyle(font.value)
  } else {
    setting.setYzforumFontStyle('system-ui')
  }
}
</script>

<template>
  <div class="font">
    <div class="title">
      <span>{{ t('header.settings.font') }}</span>
      <span v-if="setting.showYzforumFontStyle === 'system-ui'">
        {{ t('header.settings.default') }}
      </span>
      <span v-else>{{ setting.showYzforumFontStyle }}</span>
    </div>
    <div class="font-input">
      <input v-model="font" :placeholder="`${t('header.settings.fontInput')}`" required type="text">
      <button @click="setFont">{{ t('header.settings.confirm') }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.font-input {
  display: flex;
  height: 30px;
  border: 1px solid var(--yzforum-blue-5);
  color: var(--yzforum-font-color-3);
  margin-bottom: 10px;

  input {
    flex: 1;
    width: 0;
    padding-left: 8px;
    border: none;
    background-color: transparent;
    color: var(--yzforum-font-color-3);

    &:focus {
      outline: none;
      background-color: var(--yzforum-trans-blue-0);
    }
  }

  button {
    width: 80px;
    color: var(--yzforum-font-color-3);
    border: none;
    border-left: inherit;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      background-color: var(--yzforum-blue-5);
      color: var(--yzforum-white);
    }
  }
}
</style>