import {H3Event} from "h3";

/**
 * 获取远程客户端的IP地址
 * 该函数尝试通过不同的HTTP头部来确定客户端的IP地址，以适应不同的网络环境和代理配置
 * @param event H3Event对象，包含HTTP请求的相关信息
 * @returns 返回客户端的IP地址，如果无法确定，则返回空字符串
 */
export function getRemoteIp(event: H3Event) {
    /**
     * 获取通过'x-forwarded-for'头部传递的IP地址
     * 这个头部通常由代理服务器设置，表示原始客户端IP地址
     * @returns 返回IP地址或空，如果头部不存在或格式不正确
     */
    function ipForwarded() {
        // 尝试从'x-forwarded-for'头部获取IP地址，该头部可能包含多个IP地址，我们只需要第一个
        const ip = event.node.req.headers['x-forwarded-for']
        // 如果ip是数组，则返回第一个元素；否则，尝试分割字符串并返回第一个元素
        return Array.isArray(ip) ? ip[0] : ip?.split(',')[0].trim()
    }

    // 尝试从'x-real-ip'头部获取IP地址，这个头部可能由某些代理服务器设置
    const xRealIp = event.node.req.headers['x-real-ip']
    // 尝试从'cf-connecting-ip'头部获取IP地址，这个头部由Cloudflare设置
    const cfConnectingIp = event.node.req.headers['cf-connecting-ip']
    // 返回第一个非空的IP地址，优先级为：cfConnectingIp > ipForwarded > xRealIp
    // 如果都为空，则返回空字符串
    return cfConnectingIp || ipForwarded() || xRealIp || ''
}
