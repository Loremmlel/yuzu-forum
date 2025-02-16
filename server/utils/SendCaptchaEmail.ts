import {H3Event} from "h3";
import {getRemoteIp} from "~/server/utils/getRemoteIp";
import {generateRandomCode} from "~/server/utils/generateUtils";
import {createTransport} from "nodemailer";
import SMTPTransport from "nodemailer-smtp-transport";
import {ErrorCode} from "~/code&message/errorCode";

const config = useRuntimeConfig()

function getEmailContent(type: 'register' | 'forgot' | 'reset', code: string) {
    switch (type) {
        case 'register':
            return `你的验证码是:\n${code}\n你正在注册柚子游戏论坛。请不要将该验证码告诉他人。`
        case 'forgot':
            return `你的验证码是:\n${code}\n你正在找回柚子游戏论坛的密码。请不要将该验证码告诉他人。`
        case 'reset':
            return `你的验证码是:\n${code}\n你正在重置柚子游戏论坛的密码。请不要将该验证码告诉他人。`
    }
}

export async function sendCaptchaEmail(event: H3Event, email: string, type: 'register' | 'forgot' | 'reset')
    : Promise<ErrorCode> {
    const ip = getRemoteIp(event)

    const limitEmail = await useStorage('redis').getItem(`limit:email:${email}`)
    const limitIP = await useStorage('redis').getItem(`limit:ip:${ip}`)
    if (limitEmail || limitIP) {
        return ErrorCode.EmailSendCooldown
    }

    const code = generateRandomCode(6)
    await useStorage('redis').setItem(email, code, {ttl: 60 * 10})
    await useStorage('redis').setItem(`limit:email:${email}`, code, {ttl: 30})
    await useStorage('redis').setItem(`limit:ip:${ip}`, code, {ttl: 30})

    const transporter = createTransport(
        SMTPTransport({
            pool: {
                pool: true
            },
            host: config.EMAIL_HOST,
            port: Number(config.EMAIL_PORT) || 587,
            // QQ邮箱发送一定要用secure，不然会拒绝
            secure: true,
            requireTLS: true,
            auth: {
                user: config.EMAIL_ACCOUNT,
                pass: config.EMAIL_PASSWORD
            }
        })
    )

    const mailOptions = {
        from: `${config.EMAIL_FROM}<${config.EMAIL_ACCOUNT}>`,
        sender: config.EMAIL_ACCOUNT,
        to: email,
        subject: '柚子游戏论坛验证码',
        text: getEmailContent(type, code)
    }
    transporter.sendMail(mailOptions)
    return ErrorCode.NoError
}