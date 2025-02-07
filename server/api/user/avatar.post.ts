import sharp from "sharp";
import {checkBufferSize} from "~/server/utils/checkBufferSize";
import {UserModel} from "~/server/models/user";

async function resizeUserAvatar(name: string, avatar: Buffer, uid: number) {
    const miniAvatar = await sharp(avatar)
        .resize(100, 100, {
            fit: 'contain',
            background: {r: 0, g: 0, b: 0, alpha: 0}
        })
        .webp({quality: 78})
        .toBuffer()
    if (!checkBufferSize(miniAvatar, 1.0)) {
        return 10111
    }
    const miniAvatarName = `${name}-100`
    const bucketName = `image/avatar/user_${uid}`
    const avatarUrl = await saveImage(miniAvatar, bucketName, `${name}.webp`)
    if (!avatarUrl) {
        return 10111
    }
    const miniAvatarUrl = await saveImage(miniAvatar, bucketName, `${miniAvatarName}.webp`)
    if (!miniAvatarUrl) {
        return 10111
    }
    return {avatarUrl, miniAvatarUrl}
}

export default defineEventHandler(async (event) => {
    const avatarFile = await readMultipartFormData(event)
    if (!avatarFile || !Array.isArray(avatarFile)) {
        return yuzuError(event, 10110)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }

    const res = await resizeUserAvatar('avatar', avatarFile[0].data, userInfo.uid)
    if (!res) {
        return yuzuError(event, 10116)
    }
    if (typeof res === 'number') {
        return yuzuError(event, res)
    }
    const {avatarUrl, miniAvatarUrl} = res
    await UserModel.updateOne(
        {uid: userInfo.uid},
        {$set: {avatar: avatarUrl}}
    )
    return avatarUrl
})