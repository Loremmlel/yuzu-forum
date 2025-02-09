import {ForgotPasswordCaptchaRequestData} from "~/types/api/auth";
import {isValidEmail} from "~/utils/validate";
import {yuzuError} from "~/server/utils/YuzuError";
import {UserModel} from "~/server/models/user";
import {sendCaptchaEmail} from "~/server/utils/SendCaptchaEmail";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

export default defineEventHandler(async (event) => {
    const {email}: ForgotPasswordCaptchaRequestData = await readBody(event)
    if (!isValidEmail(email)) {
        return yuzuError(event, ErrorCode.InvalidEmailFormat)
    }
    const emailCount = await UserModel.countDocuments({email})
    if (emailCount === 0) {
        return yuzuError(event, ErrorCode.EmailNotRegistered)
    }
    const result = await sendCaptchaEmail(event, email, 'forgot')
    if (result !== ErrorCode.NoError) {
        return yuzuError(event, result)
    }
    return ReturnMessage.ForgotPasswordVerificationCodeSend
})