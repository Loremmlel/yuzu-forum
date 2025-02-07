import {H3Event} from "h3";
import {LoginResponseData, RegisterRequestData} from "~/types/api/user";
import {getRemoteIp} from "~/server/utils/getRemoteIp";
import {isValidEmail, isValidMailConfirmCode, isValidName, isValidPassword} from "~/utils/validate";
import {verifyCaptcha} from "~/server/utils/verifyCaptcha";
import {UserModel} from "~/server/models/user";
import {hash} from "bcrypt";
import {createTokens} from "~/server/utils/jwt";

async function registerController(event: H3Event) {
    const {name, email, password, code}: RegisterRequestData = await readBody(event)
    const ip = getRemoteIp(event)
    if (
        !isValidEmail(email) ||
        !isValidName(name) ||
        !isValidPassword(password) ||
        !isValidMailConfirmCode(code)
    ) {
        return yuzuError(event, 10107)
    }
    const registerCooldown = await useStorage('redis')
        .getItem<string>(`login:register:cd:${name}`)
    if (registerCooldown) {
        return yuzuError(event, 10113)
    } else {
        useStorage('redis').setItem(`login:register:cd:${ip}`, ip, {ttl: 60})
    }
    return {name, email, password, code, ip}
}

export default defineEventHandler(async (event) => {
    const result = await registerController(event)
    if (!result) {
        return
    }
    const {name, email, password, code, ip} = result
    const isCodeValid = await verifyCaptcha(email, code)
    if (!isCodeValid) {
        return yuzuError(event, 10103)
    }
    const usernameCount = await UserModel.countDocuments({name: {$regex: new RegExp(`^${name}$`, 'i')}})
    if (usernameCount) {
        return yuzuError(event, 10105)
    }
    const emailCount = await UserModel.countDocuments({email})
    if (emailCount) {
        return yuzuError(event, 10104)
    }
    const hashedPassword = await hash(password, 7)
    const user = new UserModel({
        name,
        email,
        password: hashedPassword,
        ip
    })
    await user.save()
    const {token, refreshToken} = await createTokens(user.uid, user.name)
    deleteCookie(event, 'yzforum-is-navigate-to-login')
    setCookie(event, 'yzforum-refresh-token', refreshToken, {
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