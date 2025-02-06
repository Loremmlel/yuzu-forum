export interface RegisterCaptchaRequestData {
    name: string
    email: string
}

export interface ForgotPasswordCaptchaRequestData {
    email: string
}

export interface ResetPasswordByEmailRequestData {
    email: string
    code: string
    newPassword: string
}