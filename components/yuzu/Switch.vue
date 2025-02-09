<script setup lang="ts">
const model = defineModel<boolean>({required: true})

const id = ref(`switch-${Math.random().toString(36).slice(2, 9)}`)
</script>

<template>
  <input type="checkbox" :id="id" v-model="model">
  <label :for="id"></label>
</template>

<style scoped lang="scss">
input {
  height: 0;
  width: 0;
  visibility: hidden;
}

label {
  cursor: pointer;
  text-indent: -900px;
  width: 50px;
  height: 25px;
  background: var(--yzforum-blue-2);
  display: block;
  border-radius: 100px;
  position: relative;
}

label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--yzforum-white);
  border-radius: 15px;
  transition: 0.3s;
}

input:checked + label {
  background: var(--yzforum-blue-5);
}

input:checked + label::after {
  left: calc(100% - 2px);
  transform: translateX(-100%);
}
</style>