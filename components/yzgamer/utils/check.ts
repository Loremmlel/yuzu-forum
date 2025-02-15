import {InfoCode} from "~/code&message/infoCode";

export function checkSendCode(email: string) {
    if (!email) {
        useMessage(InfoCode.EmptyNewEmail, 'warn')
        return false
    }
    if (!isValidEmail(email)) {
        useMessage(InfoCode.InvalidEmailFormat, 'warn')
        return false
    }
    return true
}

export function checkResetEmail(hasSentCodeEmail: string, newEmail: string, code: string) {
    if (!hasSentCodeEmail) {
        useMessage(InfoCode.VerificationCodeRequired, 'warn')
        return false
    }
    if (hasSentCodeEmail !== newEmail) {
        useMessage(InfoCode.EmailMismatch, 'warn')
        return false
    }
    if (!code) {
        useMessage(InfoCode.EmptyVerificationCode1, 'warn')
    }
    if (!isValidMailConfirmCode(code)) {
        useMessage(InfoCode.InvalidVerificationCode, 'warn')
        return false
    }
    return true
}

export function checkChangePassword(oldPassword: string, newPassword: string, repeatPassword: string) {
    if (!oldPassword) {
        useMessage(InfoCode.EmptyOldPassword, 'warn')
        return false
    }
    if (!newPassword) {
        useMessage(InfoCode.EmptyNewPasswordUser, 'warn')
        return false
    }
    if (!repeatPassword) {
        useMessage(InfoCode.ConfirmPasswordRequired, 'warn')
        return false
    }
    if (newPassword !== repeatPassword) {
        useMessage(InfoCode.PasswordMismatch, 'warn')
        return false
    }
    if (!isValidPassword(oldPassword) || !isValidPassword(newPassword)) {
        useMessage(InfoCode.IllegalPasswordFormat, 'warn', 5000)
        return false
    }
    return true
}
