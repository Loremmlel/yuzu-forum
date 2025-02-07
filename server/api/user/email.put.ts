import {UserUpdateEmailRequestData} from "~/types/api/user";
import {UserModel} from "~/server/models/user";
import {isValidEmail, isValidMailConfirmCode} from "~/utils/validate";

export default defineEventHandler(async (event) => {
    const {email, code}: UserUpdateEmailRequestData = await readBody(event)
    if (!isValidEmail(email) || !isValidMailConfirmCode(code)) {
        return yuzuError(event, 10109)
    }
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const isCodeValid = await verifyCaptcha(email, code)
    if (!isCodeValid) {
        return yuzuError(event, 10103)
    }
    await UserModel.updateOne({uid: userInfo.uid}, {$set: {email}})
    return '更新邮箱成功!'
})