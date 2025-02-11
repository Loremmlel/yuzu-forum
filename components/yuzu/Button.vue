<script setup lang="ts">
type ButtonType = 'primary' | 'danger' | ''

const props = withDefaults(defineProps<{ type?: ButtonType; pending?: boolean }>(), {
  type: '',
  pending: false
})

const {ripples, onClick} = useRipple()
</script>

<template>
  <button class="yuzu-button" @click="onClick" :class="props.type" :disabled="props.pending">
    <Icon class="icon" v-if="pending" name="svg-spinners:12-dots-scale-rotate"></Icon>
    <slot></slot>
    <YuzuRipple :ripples="ripples"></YuzuRipple>
  </button>
</template>

<style scoped lang="scss">
.yuzu-button {
  border: 1.5px solid var(--yzforum-blue-5);
  background-color: transparent;
  padding: 8px 12px;
  border-radius: 10px;
  color: var(--yzforum-blue-5);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: var(--yzforum-blue-5);
    color: var(--yzforum-white);
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: not-allowed;
    border: 1.5px solid var(--yzforum-blue-3);
    color: var(--yzforum-blue-3);

    &:hover {
      background-color: transparent;
      color: var(--yzforum-blue-3);
    }
  }

  .icon {
    font-size: medium;
    margin-right: 7px;
  }
}

.primary {
  background-color: var(--yzforum-blue-5);
  color: var(--yzforum-white);

  &:disabled {
    border: 1.5px solid var(--yzforum-blue-3);
    background-color: var(--yzforum-blue-3);
    color: var(--yzforum-white);
  }
}

.danger {
  border: 1.5px solid var(--yzforum-red-5);
  color: var(--yzforum-red-5);

  &:hover {
    background-color: var(--yzforum-red-5);
    color: var(--yzforum-white);
  }

  &:disabled {
    border: 1.5px solid var(--yzforum-red-3);
    color: var(--yzforum-red-3);

    &:hover {
      background-color: transparent;
      color: var(--yzforum-red-3);
    }

    &:active {
      transform: none;
    }
  }
}
</style>