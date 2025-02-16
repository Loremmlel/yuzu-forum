<script lang="ts" setup>
const model = defineModel<boolean>({required: true})
</script>

<template>
  <label class="yuzu-checkbox">
    <input v-model="model" type="checkbox">
    <span class="checkmark"></span>
    <slot></slot>
  </label>
</template>

<style lang="scss" scoped>
/**
 * 自定义复选框样式，包括布局和交互效果
 */
.yuzu-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-left: 32px;
  font-size: 16px;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    /**
     * 定义复选框被选中时的样式，包括背景色、边框色和勾选图标
     */
    &:checked ~ .checkmark {
      background-color: var(--yzforum-blue-5);
      border-color: var(--yzforum-blue-5);

      &:after {
        display: block;
      }
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: var(--yzforum-white);
    border: 2px solid var(--yzforum-blue-5);
    border-radius: 4px;
    transition: all 0.3s ease;

    /**
     * 定义勾选图标的具体样式，包括位置、大小和颜色
     */
    &:after {
      content: '';
      position: absolute;
      display: none;
      top: 1px;
      left: 5px;
      width: 4px;
      height: 10px;
      border: solid var(--yzforum-white);
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
}
</style>
