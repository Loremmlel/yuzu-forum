/**
 * 函数节流器，限制函数执行的频率
 * @param executeCallback 要执行的主要回调函数
 * @param delay 节流的时间间隔，单位为毫秒
 * @param delayedCallback 延迟执行的回调函数，可选
 * @returns 返回一个节流后的函数
 */
export function throttle<T extends (...args: any[]) => void>(
    executeCallback: T,
    delay: number,
    delayedCallback?: T
) {
    // 记录最后一次执行的时间戳
    let lastExecution = 0
    // 定时器，用于延迟执行的回调
    let timeout: NodeJS.Timeout | null = null

    // 返回一个新的函数，该函数会根据节流规则来决定是否执行
    return function (...args: Parameters<T>) {
        // 当前时间戳
        const now = Date.now()

        // 如果距离上次执行已经超过设定的延迟时间，或者尚未初始化执行
        if (!lastExecution || now - lastExecution >= delay) {
            // 执行主要回调函数，并更新最后一次执行的时间戳
            executeCallback(...args)
            lastExecution = now
        } else if (!timeout && delayedCallback) {
            // 如果没有定时器且提供了延迟执行的回调函数，则执行延迟回调
            delayedCallback(...args)
            // 设置定时器，在指定的延迟时间后清除定时器
            timeout = setTimeout(() => {
                timeout = null
            }, delay)
        }
    }
}
