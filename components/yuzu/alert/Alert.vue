<script lang="ts" setup>
const {locale, t} = useI18n()
const message = useComponentMessageStore()

function handleClose() {
  message.showAlert = false
  message.handleClose()
}

function handleConfirm() {
  message.showAlert = false
  message.handleConfirm()
}
</script>

<template>
  <YuzuDialog :show-dialog="message.showAlert">
    <div class="container">
      <div class="header">
        <h3 v-if="message.alertTitle">{{ message.alertTitle[locale] }}</h3>
        <p v-if="message.alertMessage">{{ message.alertMessage[locale] }}</p>
      </div>

      <div class="footer">
        <button v-if="message.showCancel || true" class="button" @click="handleClose">
          {{ t('ComponentAlert.cancel') }}
        </button>
        <button class="button" @click="handleConfirm">
          {{ t('ComponentAlert.confirm') }}
        </button>
      </div>
    </div>
  </YuzuDialog>
</template>

<style lang="scss" scoped>
.container {
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  background-color: var(--yzforum-trans-white-2);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;

  .header {
    h3 {
      margin-bottom: 8px;
    }

    p {
      font-size: small;
    }
  }
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.button {
  width: 80px;
  height: 30px;
  cursor: pointer;
  border-radius: 2px;

  &:nth-child(1) {
    background-color: transparent;
    border: 1px solid var(--yzforum-blue-5);
    color: var(--yzforum-blue-5)
  }

  &:nth-child(2) {
    margin-left: 100px;
    background-color: transparent;
    border: 1px solid var(--yzforum-red-5);
    color: var(--yzforum-red-5);
  }

  &:active {
    transform: scale(0.9);
    transition: 0.15s;
  }
}
</style>