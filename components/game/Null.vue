<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()
</script>

<template>
  <div class="null">
    <span>{{ t('game.null') }}</span>
    <span @click="useMessage(InfoCode.EditButtonReminder, 'info')">
      {{ t('game.welcome') }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.null {
  font-size: small;
  color: var(--yzforum-font-color-0);
  font-style: oblique;

  span {
    &:last-child {
      cursor: pointer;
      color: var(--yzforum-blue-5);
    }
  }
}
</style>