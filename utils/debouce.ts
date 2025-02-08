/**
 * 节流函数，用于限制函数的执行频率
 * @param fn 要进行节流处理的函数
 * @param time 节流时间间隔，单位为毫秒
 * @returns 返回一个新的节流函数，该函数将在指定时间间隔内最多执行一次
 *
 * 说明：
 * 节流函数的主要作用是限制函数的执行频率，确保在一定时间间隔内只执行一次函数
 * 这在处理一些高频触发的事件（如窗口调整大小、滚动、键盘输入等）时非常有用，可以有效避免函数被频繁调用
 */
export function debounce<F extends (...args: any[]) => any>(fn: F, time: number)
:((...args: Parameters<F>) => void){
    // 定义一个变量来存储 setTimeout 的引用
    let timeout: NodeJS.Timeout | null = null

    // 返回一个新的函数，该函数将应用节流逻辑
    return function (...args: Parameters<F>) {
        // 如果上一次的 setTimeout 还未执行完毕，则清除它
        if (timeout !== null) {
            clearTimeout(timeout)
        }

        // 设置一个新的 setTimeout，确保在指定时间间隔后执行原函数
        timeout = setTimeout(() => {
            fn(...args)
        }, time)
    }
}
