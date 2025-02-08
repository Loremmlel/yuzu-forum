// 导入所需的模块和类型
import {Server, Socket} from 'socket.io'
import {YzForumPayload} from "~/types/utils/jwt";
import {NitroApp} from "nitropack/types";
import {Server as Engine} from 'engine.io'
import {parse} from 'cookie-es'
import jwt from "jsonwebtoken";
import env from '~/server/env/dotenv'
import {handleSocketRequest} from "~/server/socket/handleSocketRequest";

export interface YzforumSocket extends Socket {
    payload?: YzForumPayload
}

export default defineNitroPlugin((nitroApp: NitroApp) => {
    // 创建engine.io服务器实例
    const engine = new Engine()
    // 创建socket.io服务器实例
    const io = new Server()

    // 将engine.io服务器绑定到socket.io服务器
    io.bind(engine)

    // 使用中间件来验证和解析客户端的JWT令牌
    io.use((socket: YzforumSocket, next) => {
        // 从客户端请求的cookie中解析令牌
        const token = parse(socket.request.headers.cookie ?? '')
        const refreshToken = token['yzforum-refresh-token']

        try {
            // 验证令牌并解析payload，然后将其附加到socket对象
            socket.payload = jwt.verify(
                refreshToken,
                env.JWT_SECRET ?? '') as YzForumPayload
            // 继续处理连接
            next()
        } catch (err) {
            // 如果令牌验证失败，返回错误
            return err
        }
    })

    // 监听连接事件，当有新客户端连接时，调用handleSocketRequest函数处理
    io.on('connection', handleSocketRequest)

    // 在Nitro应用的路由中使用engine.io服务器，处理WebSocket请求
    nitroApp.router.use(
        '/socket.io/',
        defineEventHandler({
            handler(event) {
                // 使用engine.io服务器处理请求
                engine.handleRequest(<any>event.node.req, event.node.res)
                // 标记事件为已处理，以避免进一步的路由处理
                event._handled = true
            }
        })
    )
})
