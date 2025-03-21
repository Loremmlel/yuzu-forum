import type {ResetPasswordByEmailRequestData} from '~/types/api/auth'
import {verifyCaptcha} from "~/server/utils/verifyCaptcha";
import {hash} from "bcrypt";
import {UserModel} from "~/server/models/user";
import {isValidEmail, isValidMailConfirmCode, isValidPassword} from "~/utils/validate";
import {yuzuError} from "~/server/utils/YuzuError";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

async function resetPasswordByEmail(email: string, code: string, newPassword: string): Promise<ErrorCode> {
    const validEmail = await verifyCaptcha(email, code)
    if (!validEmail) {
        return ErrorCode.EmailVerificationCodeIncorrect
    }
    const hashedPassword = await hash(newPassword, 7)
    const user = await UserModel.findOneAndUpdate(
        {email},
        {$set: {password: hashedPassword}}
    )
    if (!user) {
        return ErrorCode.UserNotFound
    }
    return ErrorCode.NoError
}

export default defineEventHandler(async (event) => {
    const {email, code, newPassword}: ResetPasswordByEmailRequestData =
        await readBody(event)
    if (
        !isValidEmail(email) ||
        !isValidMailConfirmCode(code) ||
        !isValidPassword(newPassword)
    ) {
        return yuzuError(event, ErrorCode.InvalidEmailCredentials)
    }

    const result = await resetPasswordByEmail(email, code, newPassword)
    if (result !== ErrorCode.NoError) {
        return yuzuError(event, result)
    }
    return ReturnMessage.ResetPassword
})