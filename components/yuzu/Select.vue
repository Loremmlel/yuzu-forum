<script lang="ts" setup>
import type {CSSProperties} from "vue";

interface Props {
  options: string[]
  i18n?: string
  discardI18n?: boolean
  styles?: CSSProperties
  selectorStyles?: CSSProperties
  position?: 'top' | 'bottom'
  defaultValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom'
})

const {t} = useI18n()

const container = ref<HTMLElement>()
const showOptions = ref(false)
const checkedValue = ref(props.defaultValue ?? '')

const emit = defineEmits<{ set: [value: string, index?: number] }>()

function handleClickShowLanguage() {
  showOptions.value = true
  container.value?.focus()
}

function handleSetOption(value: string, index?: number) {
  emit('set', value, index)
  checkedValue.value = value
}
</script>

<template>
  <div :style="props.styles" class="yuzu-select">
    <div ref="container" :style="props.selectorStyles" class="yuzu-selector" tabindex="-1"
         @blur="showOptions = false" @click="handleClickShowLanguage">
      <slot></slot>
      <Icon class="icon" name="lucide:chevron-down"></Icon>
    </div>

    <Transition :name="position">
      <div v-if="showOptions" :class="position" class="options">
        <span v-for="(option, index) in props.options" :key="index"
              @click.stop.prevent="handleSetOption(option, index)">
          <span>{{ props.discardI18n ? option : t(`${props.i18n}.${option}`) }}</span>
          <span v-if="checkedValue === option">
            <Icon class="icon" name="lucide:check"></Icon>
          </span>
        </span>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.yuzu-select {
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.yuzu-selector {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .icon {
    font-size: 18px;
    color: var(--yzforum-blue-5);
    margin-left: 8px;
  }
}

.options {
  width: 100%;
  position: absolute;
  padding: 8px;
  border: 1px solid var(--yzforum-trans-blue-1);
  z-index: 9999;
  @include yz-blur;

  & > span {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    border-radius: 5px;

    &:hover {
      background-color: var(--yzforum-trans-blue-0);
    }
  }
}

.top {
  bottom: 100%;
}

.bottom {
  top: 100%;
}

.top-enter-active, .bottom-leave-active,
.bottom-enter-active, .top-leave-active {
  transition: all 0.3s ease-in-out;
}

.top-enter-from, .bottom-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.bottom-enter-from, .top-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>