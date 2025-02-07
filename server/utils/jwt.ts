import {YzForumPayload} from "~/types/utils/jwt";
import jwt from "jsonwebtoken";

const config = useRuntimeConfig()

export function generateToken(uid: number, name: string, expire: string): string {
    const payload: YzForumPayload = {
        iss: config.JWT_ISS,
        aud: config.JWT_AUD,
        uid,
        name
    }
    // 不as就报没有重载的错误
    return jwt.sign(payload, config.JWT_SECRET, {expiresIn: expire} as jwt.SignOptions)
}

export async function createTokens(uid: number, name: string) {
    const token = generateToken(uid, name, '60m')
    const refreshToken = generateToken(uid, name, '30d')
    await useStorage('redis').setItem(`refreshToken:${uid}`, refreshToken, {ttl: 30 * 24 * 60 * 60})
    return {token, refreshToken}
}