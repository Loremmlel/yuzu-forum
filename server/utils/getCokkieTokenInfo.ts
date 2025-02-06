import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import type { YzForumPayload } from '~/types/utils/jwt'

const config = useRuntimeConfig()

export async function getCookieTokenInfo(event: H3Event) {
    const refreshToken = getCookie(event, 'yuzu-forum-refresh-token')
    if (!refreshToken) {
        return null
    }
    try {
        const payload = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        ) as YzForumPayload
        const redisToken = await useStorage('redis').getItem(`refreshToken:${payload.uid}`)
        if (!redisToken) {
            return null
        }
        return payload
    } catch (err) {
        return null
    }
}