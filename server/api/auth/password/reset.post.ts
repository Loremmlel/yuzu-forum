import type {ResetPasswordByEmailRequestData} from '~/types/api/auth'
import {verifyCaptcha} from "~/server/utils/verifyCaptcha";
import {hash} from "bcrypt";
import {UserModel} from "~/server/models/user";
import {isValidEmail, isValidMailConfirmCode, isValidPassword} from "~/utils/validate";
import {yuzuError} from "~/server/utils/YuzuError";

async function resetPasswordByEmail(email: string, code: string, newPassword: string) {
    const validEmail = verifyCaptcha(email, code)
    if (!validEmail) {
        return 10103
    }
    const hashedPassword = await hash(newPassword, 7)
    const user = await UserModel.findOneAndUpdate(
        {email},
        {$set: {password: hashedPassword}}
    )
    if (!user) {
        return 10101
    }
    return null
}

export default defineEventHandler(async (event) => {
    const {email, code, newPassword}: ResetPasswordByEmailRequestData =
        await readBody(event)
    if (
        !isValidEmail(email) ||
        !isValidMailConfirmCode(code) ||
        !isValidPassword(newPassword)
    ) {
        return yuzuError(event, 10303)
    }

    const result = await resetPasswordByEmail(email, code, newPassword)
    if (typeof result === 'number') {
        return yuzuError(event, result)
    }
    return '重设密码成功!'
})