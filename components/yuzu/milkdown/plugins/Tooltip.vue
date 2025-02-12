<script setup lang="ts">
import {usePluginViewContext} from "@prosemirror-adapter/vue";
import {useInstance} from "@milkdown/vue";
import type {VNodeRef} from "vue";
import {TooltipProvider} from "@milkdown/plugin-tooltip";
import {Icon} from "#components";
import type {CmdKey} from "@milkdown/core";
import {callCommand} from "@milkdown/utils";
import {toggleEmphasisCommand, toggleInlineCodeCommand, toggleStrongCommand} from "@milkdown/preset-commonmark";
import {toggleStrikethroughCommand} from "@milkdown/preset-gfm";

// 使用ProseMirror与Vue集成的上下文钩子，获取当前编辑器视图和之前的状态
// view用于访问ProseMirror的编辑器实例，prevState用于追踪状态变化
const {view, prevState} = usePluginViewContext()

// 获取Milkdown编辑器实例，loading表示编辑器是否加载完成，get用于获取实例
// 用于确保在编辑器初始化完成后再操作命令
const [loading, get] = useInstance()

// 创建对DOM元素的引用，用于将工具提示内容挂载到该元素
// Vue3中需要使用ref获取组件实例的DOM节点
const divRef = ref<VNodeRef>()
let tooltipProvider: TooltipProvider // 工具提示控制实例，管理位置和显示逻辑

// 使用图标组件创建可复用的VNode，优化渲染性能
// 每个图标对应不同的格式操作，通过h函数提前创建避免重复渲染开销
const YuzuBold = h(Icon, {name: 'lucide:bold'})
const YuzuItalic = h(Icon, {name: 'lucide:italic'})
const YuzuStrikethrough = h(Icon, {name: 'lucide:strikethrough'})
const YuzuCode = h(Icon, {name: 'lucide:code-xml'})

onMounted(() => {
  // 组件挂载后初始化工具提示，此时DOM已渲染可安全操作
  // 将divRef转换为HTMLElement供TooltipProvider使用（Vue3的ref类型需要转换）
  tooltipProvider = new TooltipProvider({
    content: divRef.value as unknown as HTMLElement
  })
  // 初始更新工具提示位置，基于当前视图和状态
  tooltipProvider.update(view.value, prevState.value)
})

// 监听视图和状态变化，实时更新工具提示位置
// 当用户滚动或编辑内容导致视图变化时，保持工具提示位置正确
watch([view, prevState], () => {
  tooltipProvider?.update(view.value, prevState.value)
})

onUnmounted(() => {
  // 组件卸载时销毁工具提示，防止内存泄漏
  tooltipProvider.destroy()
})

// 通用命令执行方法，使用泛型支持不同类型的命令参数
// 封装Milkdown的命令调用机制，简化按钮的事件处理
const call = <T, >(command: CmdKey<T>, payload?: T) => {
  // 通过编辑器实例执行命令，callCommand是Milkdown的通用命令触发器
  return get()?.action(callCommand(command, payload))
}
</script>

<template>
  <!-- 仅在加载完成后渲染，避免空DOM操作 -->
  <!-- tooltip容器使用绝对定位，样式通过CSS变量实现主题化 -->
  <div v-if="loading" class="tooltip" ref="divRef">
    <!-- 每个按钮对应特定格式命令，点击触发call方法 -->
    <!-- 使用预创建的图标VNode优化渲染性能 -->
    <button @click="call(toggleStrongCommand.key)">
      <YuzuBold></YuzuBold>
    </button>

    <button @click="call(toggleEmphasisCommand.key)">
      <YuzuItalic></YuzuItalic>
    </button>

    <button @click="call(toggleStrikethroughCommand.key)">
      <YuzuStrikethrough></YuzuStrikethrough>
    </button>

    <button @click="call(toggleInlineCodeCommand.key)">
      <YuzuCode></YuzuCode>
    </button>
  </div>
</template>

<style scoped lang="scss">
.tooltip {
  position: absolute;
  display: flex;
  background-color: var(--yzforum-trans-white-2);
  border: 1px solid var(--yzforum-blue-5);
  border-radius: 5px;
  backdrop-filter: blur(10px);
  z-index: 9999;

  &[data-show='false'] {
    display: none;
  }

  button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
    margin: 5px;
    font-size: 22px;
    color: var(--yzforum-font-color-3);
    background-color: transparent;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid var(--yzforum-blue-5);
      color: var(--yzforum-blue-5);
    }
  }
}
</style>