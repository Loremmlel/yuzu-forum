<script lang="ts" setup>
const {t} = useI18n()

const input = ref<HTMLInputElement>()

function handleCustomBackground() {
  input.value?.click()
}

async function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0]) {
    return
  }
  const file = input.files[0]
  await usePersistSettingsStore().setCustomBackground(file)
}
</script>

<template>
  <div class="yzgamer-bg">
    <input ref="input" accept="image/*" hidden type="file" @change="handleFileChange($event)">
    <span class="custom" @click="handleCustomBackground">
      <span class="custom-pc">{{ t('header.settings.custom') }}</span>
      <span class="custom-mobile">{{ t('header.hamburger.background') }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.yzgamer-bg {
  display: flex;
  flex-direction: column;

  .custom {
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 10px;
    box-shadow: var(--shadow);
    color: var(--yzforum-font-color-3);
    @include yz-center;

    &:hover {
      background-color: var(--yzforum-trans-blue-0);
      color: var(--yzforum-blue-5);
    }
  }
}

.custom-mobile {
  display: none;
}

@media screen and (max-width: 768px) {
  .custom-pc {
    display: none;
  }

  .custom-mobile {
    display: block;
  }
}
</style>