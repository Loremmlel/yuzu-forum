<script setup lang="ts">
const {t} = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="blank">
    <div class="container">
      <h1>
        <slot/>
      </h1>
      <button @click="navigateTo(localePath('/'))">
        {{ t('yzforum.home') }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blank {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.container {
  width: 400px;
  height: 300px;

  @include yz-blur;
  @include yz-center;
  flex-direction: column;

  h1 {
    color: var(--yzforum-red-5);
  }

  button {
    cursor: pointer;
    margin-top: 20px;
    border: 1px solid var(--yzforum-blue-5);
    padding: 10px 50px;
    border-radius: 5px;
    color: var(--yzforum-blue-5);
    background-color: transparent;

    &:hover {
      background-color: var(--yzforum-blue-5);
      color: var(--yzforum-white);
    }
  }
}
</style>