import {ForgotPasswordCaptchaRequestData} from "~/types/api/auth";
import {isValidEmail} from "~/utils/validate";
import {yuzuError} from "~/server/utils/YuzuError";
import {UserModel} from "~/server/models/user";
import {sendCaptchaEmail} from "~/server/utils/SendCaptchaEmail";

export default defineEventHandler(async (event) => {
    const {email}: ForgotPasswordCaptchaRequestData = await readBody(event)
    if (!isValidEmail(email)) {
        return yuzuError(event, 10302)
    }
    const emailCount = await UserModel.countDocuments({email})
    if (emailCount === 0) {
        return yuzuError(event, 10304)
    }
    const result = await sendCaptchaEmail(event, email, 'forgot')
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }
    return '发送忘记密码验证码成功!'
})