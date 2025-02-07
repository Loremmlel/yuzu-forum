import {isValidPassword} from "~/utils/validate";
import {UserUpdatePasswordRequestData} from "~/types/api/user";
import {UserModel} from "~/server/models/user";
import {compare, hash} from "bcrypt";

export default defineEventHandler(async (event) => {
    const {oldPassword, newPassword}: UserUpdatePasswordRequestData = await readBody(event)
    if (!isValidPassword(oldPassword) || !isValidPassword(newPassword)) {
        return yuzuError(event, 10108)
    }
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const uid = userInfo.uid
    const user = await UserModel.findOne({uid})
    if (!user) {
        return yuzuError(event, 10101)
    }
    const isPasswordCorrect = await compare(oldPassword, user.password)
    if (!isPasswordCorrect) {
        return yuzuError(event, 10102)
    }
    const hashedPassword = await hash(newPassword, 7)
    await UserModel.updateOne({uid}, {$set: {password: hashedPassword}})
    return '更新密码成功!'
})