<script lang="ts" setup>
/**
 * 定义滑块组件的属性接口
 */
interface Props {
  min: number
  max: number
  step: number
}

/**
 * 获取组件属性，并设置默认值
 */
const props = withDefaults(defineProps<Props>(), {
  min: 10,
  max: 80,
  step: 1
})

const value = defineModel<number>({required: true})

const slider = ref<HTMLElement | null>(null)
const dragging = ref(false)

/**
 * 创建状态对象，包含滑块的最小值、最大值和步长
 */
const state = reactive({
  min: props.min,
  max: props.max,
  step: props.step
})

/**
 * 计算填满部分的宽度，根据滑块值动态变化
 */
const fillerWidth = computed(() => {
  return ((value.value - state.min) / (state.max - state.min)) * 100 + '%'
})

/**
 * 计算滑块的样式，包括位置和变换
 */
const thumbStyle = computed(() => ({
  left: fillerWidth.value,
  transform: 'translate(-50%, -50%)'
}))

/**
 * 开始拖动滑块时的处理函数
 * @param {MouseEvent | TouchEvent} e - 鼠标或触摸事件
 */
function startDrag(e: MouseEvent | TouchEvent) {
  dragging.value = true
  updateSliderValue(e)
  window.addEventListener('mousemove', updateSliderValue)
  window.addEventListener('touchmove', updateSliderValue)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchend', endDrag)
}

/**
 * 结束拖动滑块时的处理函数
 */
function endDrag() {
  dragging.value = false
  window.removeEventListener('mousemove', updateSliderValue)
  window.removeEventListener('touchmove', updateSliderValue)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchend', endDrag)
}

/**
 * 更新滑块值的处理函数
 * @param {MouseEvent | TouchEvent} e - 鼠标或触摸事件
 */
function updateSliderValue(e: MouseEvent | TouchEvent) {
  if (!slider.value) {
    return
  }
  const rect = slider.value.getBoundingClientRect()
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const newValue = ((clientX - rect.left) / rect.width) * (state.max - state.min) + state.min
  value.value = Math.min(state.max, Math.max(state.min, Math.round(newValue / state.step) * state.step))
}

onUnmounted(() => {
  endDrag()
})
</script>

<template>
  <!-- 滑块组件的主结构 -->
  <div ref="slider" class="yuzu-slider" @mousedown.passive="startDrag" @touchstart.passive.stop="startDrag">
    <!-- 滑块轨道 -->
    <div class="slider-track">
      <!-- 填满部分 -->
      <div :style="{width: fillerWidth}" class="slider-filler"></div>
      <!-- 滑块 -->
      <div :aria-valuemax="props.max" :aria-valuemin="props.min" :aria-valuenow="value" :style="thumbStyle"
           aria-orientation="horizontal" class="slider-thumb" role="slider" tabindex="0"
           @mousedown.passive="startDrag" @touchstart.passive.stop="startDrag"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 滑块轨道的样式 */
.slider-track {
  position: relative;
  background-color: var(--yzforum-gray-4);
  border-radius: 999px;
  width: 100%;
  height: 8px;
}

/* 填满部分的样式 */
.slider-filler {
  position: absolute;
  background-color: var(--yzforum-blue-5);
  height: 100%;
  border-radius: inherit;
}

/* 滑块的样式 */
.slider-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background-color: var(--yzforum-white);
  border: 3px solid var(--yzforum-blue-5);
  border-radius: 50%;
  cursor: grab;
  box-shadow: var(--shadow);
  transition: border 0.1s;

  &:active {
    cursor: grabbing;
    border: 4px solid var(--yzforum-blue-5)
  }
}
</style>
