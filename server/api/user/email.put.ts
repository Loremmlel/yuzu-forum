import {UserUpdateEmailRequestData} from "~/types/api/user";
import {UserModel} from "~/server/models/user";
import {isValidEmail, isValidMailConfirmCode} from "~/utils/validate";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const {email, code}: UserUpdateEmailRequestData = await readBody(event)
    if (!isValidEmail(email) || !isValidMailConfirmCode(code)) {
        return yuzuError(event, ErrorCode.InvalidEmailOrVerificationCodeFormat)
    }
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const isCodeValid = await verifyCaptcha(email, code)
    if (!isCodeValid) {
        return yuzuError(event, ErrorCode.EmailVerificationCodeIncorrect)
    }
    await UserModel.updateOne({uid: userInfo.uid}, {$set: {email}})
    return '更新邮箱成功!'
})