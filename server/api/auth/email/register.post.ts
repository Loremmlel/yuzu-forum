import {RegisterCaptchaRequestData} from "~/types/api/auth";
import {isValidEmail} from "~/utils/validate";
import {yuzuError} from "~/server/utils/YuzuError";
import {UserModel} from "~/server/models/user";
import {sendCaptchaEmail} from "~/server/utils/SendCaptchaEmail";

export default defineEventHandler(async (event) => {
    const {name, email}: RegisterCaptchaRequestData = await readBody(event)
    if (!isValidEmail(email)) {
        return yuzuError(event, 10302)
    }
    const usernameCount = await UserModel.countDocuments({
        name: {$regex: new RegExp('^' + name + '$', 'i')}
    })
    if (usernameCount > 0) {
        return yuzuError(event, 10105)
    }
    const emailCount = await UserModel.countDocuments({email})
    if (emailCount > 0) {
        return yuzuError(event, 10104)
    }
    const result = await sendCaptchaEmail(event, email, 'register')

    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return '发送注册账号验证码成功!'
})