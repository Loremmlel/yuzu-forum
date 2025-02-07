import {isValidEmail} from "~/utils/validate";
import {UserModel} from "~/server/models/user";
import {ForgotPasswordCaptchaRequestData} from "~/types/api/auth";
import {yuzuError} from "~/server/utils/YuzuError";
import {sendCaptchaEmail} from "~/server/utils/SendCaptchaEmail";

export default defineEventHandler(async (event) => {
    const {email}: ForgotPasswordCaptchaRequestData =
        await readBody(event)

    if (!isValidEmail(email)) {
        return yuzuError(event, 10302)
    }

    const emailCounts = await UserModel.countDocuments({email})
    if (emailCounts) {
        return yuzuError(event, 10104)
    }

    const result = await sendCaptchaEmail(event, email, 'reset')
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }

    return '发送重置邮箱验证码成功!'
})