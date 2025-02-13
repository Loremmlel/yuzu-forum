import sharp from "sharp";
import {checkBufferSize} from "~/server/utils/checkBufferSize";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/code&message/errorCode";
import path from "node:path";

async function resizeUserAvatar(name: string, avatar: Buffer, uid: number) {
    const miniAvatar = await sharp(avatar)
        .resize(100, 100, {
            fit: 'contain',
            background: {r: 0, g: 0, b: 0, alpha: 0}
        })
        .webp({quality: 78})
        .toBuffer()
    if (!checkBufferSize(miniAvatar, 1.0)) {
        return ErrorCode.CompressedImageSizeExceeded
    }
    const miniAvatarName = `${name}-100`
    const bucketName = `image/avatar/user_${uid}`
    const avatarUrl = await saveImage(miniAvatar, bucketName, `${name}.webp`)
    if (!avatarUrl) {
        return ErrorCode.CompressedImageSizeExceeded
    }
    const miniAvatarUrl = await saveImage(miniAvatar, bucketName, `${miniAvatarName}.webp`)
    if (!miniAvatarUrl) {
        return ErrorCode.CompressedImageSizeExceeded
    }
    return {
        avatarUrl: path.relative('/' + path.join(process.cwd(), 'public'), avatarUrl),
        miniAvatarUrl: path.relative('/' + path.join(process.cwd(), 'public'), miniAvatarUrl)
    }
}

export default defineEventHandler(async (event) => {
    const avatarFile = await readMultipartFormData(event)
    if (!avatarFile || !Array.isArray(avatarFile)) {
        return yuzuError(event, ErrorCode.ImageUploadEmptyError)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const res = await resizeUserAvatar('avatar', avatarFile[0].data, userInfo.uid)
    if (!res) {
        return yuzuError(event, ErrorCode.UnknownImageUploadError)
    }
    if (typeof res === 'number') {
        return yuzuError(event, res)
    }
    const {avatarUrl} = res
    await UserModel.updateOne(
        {uid: userInfo.uid},
        {$set: {avatar: avatarUrl}}
    )
    return avatarUrl
})