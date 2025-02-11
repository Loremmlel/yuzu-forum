/**
 * 定义涟漪效果的类型
 * 用于存储每个涟漪的属性，包括唯一键、位置和大小
 */
export type RippleType = {
    key: number
    x: number
    y: number
    size: number
}

/**
 * 使用ripple效果的钩子函数
 * 该函数用于管理ripple动画的状态和行为
 * 它提供了一个事件处理函数onClick，用于在用户点击时生成ripple效果
 * @returns 包含两个属性：ripples（ripple效果的数组）和onClick（点击事件的处理函数）
 */
export const useRipple = () => {
    // 使用ref来响应式地管理ripple数组
    const ripples = ref<RippleType[]>([])

    /**
     * 点击事件的处理函数
     * 当用户点击时，根据点击位置和时间生成一个新的ripple效果
     * @param {MouseEvent} event - 点击事件对象
     */
    const onClick = (event: MouseEvent) => {
        const target = event.currentTarget as HTMLElement

        // 计算ripple的大小，取目标元素宽度和高度的最大值
        const size = Math.max(target.clientWidth, target.clientHeight)
        const rect = target.getBoundingClientRect()

        // 根据点击位置和时间创建一个新的ripple效果，并添加到ripples数组中
        ripples.value.push({
            key: Date.now(),
            size,
            x: event.clientX - rect.left - size / 2,
            y: event.clientY - rect.top - size / 2
        })

        // 设置一个定时器，在600毫秒后移除第一个ripple效果，以实现ripple的动画效果
        setTimeout(() => {
            ripples.value.shift()
        }, 600)
    }

    return {
        ripples,
        onClick
    }
}
