import {H3Event} from "h3";
import {LoginRequestData, LoginResponseData} from "~/types/api/user";
import {isValidEmail, isValidName, isValidPassword} from "~/utils/validate";
import {UserModel} from "~/server/models/user";
import {compare} from "bcrypt";
import {createTokens} from "~/server/utils/jwt";

async function login(event: H3Event) {
    const {name, password}: LoginRequestData = await readBody(event)
    const ip = getRemoteIp(event)
    if (!(isValidName(name) || isValidEmail(name)) || !isValidPassword(password)) {
        return yuzuError(event, 10107)
    }
    const loginCooldown = await useStorage('redis').getItem<string>(`login:login:cd:${ip}`)
    if (loginCooldown) {
        return yuzuError(event, 10112)
    } else {
        useStorage('redis').setItem(`login:login:cd:${ip}`, ip, {ttl: 15})
    }
    return {name, password}
}

export default defineEventHandler(async (event) => {
    const result = await login(event)
    if (!result) {
        return
    }
    const {name, password} = result

    const user = await UserModel.findOne({$or: [{name}, {email: name}]})
    if (!user) {
        return yuzuError(event, 10101)
    }
    if (user.status !== 0) {
        return yuzuError(event, 10120)
    }

    const isPasswordCorrect = await compare(password, user.password)
    if (!isPasswordCorrect) {
        return yuzuError(event, 10102)
    }

    const {token, refreshToken} = await createTokens(user.uid, user.name)
    deleteCookie(event, 'yzforum-is-navigate-to-login')
    setCookie(event, 'yz-forum-refresh-token', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    return {
        uid: user.uid,
        name: user.name,
        avatar: user.avatar,
        point: user.point,
        roles: user.roles,
        token
    } as LoginResponseData
})