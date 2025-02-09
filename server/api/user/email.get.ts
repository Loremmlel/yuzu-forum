import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const user = await UserModel.findOne({uid: userInfo.uid})
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    const email = user.email
    const atIndex = email.indexOf('@')
    const localPart = email.slice(0, atIndex)
    const domain = email.slice(atIndex)
    const maskedLocalPart = localPart.slice(0, 2) + '*******'
    return maskedLocalPart + domain
})