<script lang="ts" setup>
const value = defineModel<string | number | string[]>({
  required: true
})
withDefaults(defineProps<{ placeholder: string }>(), {
  placeholder: '「我喜欢你，你喜欢我」'
})
</script>

<template>
  <div class="yuzu-textarea">
    <textarea v-model="value" :placeholder="placeholder" name="comment" rows="5"></textarea>
    <span class="yuzu-textarea-count">{{ value.toString().trim().length }}</span>
  </div>
</template>

<style lang="scss" scoped>
.yuzu-textarea {
  position: relative;

  textarea {
    color: var(--yzforum-font-color-3);
    margin-bottom: 10px;
    width: 100%;
    border: 1px solid var(--yzforum-trans-blue-2);
    background-color: transparent;
    border-radius: 10px;
    padding: 5px;
    resize: vertical;

    &:focus {
      border: 1px solid var(--yzforum-blue-5);
      background-color: var(--yzforum-trans-blue-0);
      box-shadow: 0 0 0 0.5px var(--yzforum-blue-5);
    }
  }

  .yuzu-textarea-count {
    font-size: small;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>