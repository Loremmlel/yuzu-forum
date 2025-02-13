import sharp from "sharp";
import {checkBufferSize} from "~/server/utils/checkBufferSize";
import {UserModel} from "~/server/models/user";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {ErrorCode} from "~/code&message/errorCode";

async function compressImage(name: string, image: Buffer, uid: number) {
    const miniImage = await sharp(image)
        .resize(1920, 1080, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .webp({quality: 77})
        .toBuffer();

    if (!checkBufferSize(miniImage, 1.007)) {
        return ErrorCode.CompressedImageSizeExceededLimit
    }

    const bucketName = `image/topic/user_${uid}`
    return saveImage(miniImage, bucketName, `${name}.webp`);
}

export default defineEventHandler(async (event) => {
    const imageFile = await readMultipartFormData(event)
    if (!imageFile || !Array.isArray(imageFile)) {
        return yuzuError(event, ErrorCode.ImageUploadArrayError)
    }
    if (!checkBufferSize(imageFile[0].data, 10)) {
        return yuzuError(event, ErrorCode.ImageSizeExceeded)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const user = await UserModel.findOne({uid: userInfo.uid})
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    if (user.dailyImageCount >= 50) {
        return yuzuError(event, ErrorCode.DailyImageUploadLimit)
    }

    const newFilename = `${userInfo.name}-${Date.now()}`
    const res = await compressImage(newFilename, imageFile[0].data, userInfo.uid)
    if (!res) {
        return yuzuError(event, ErrorCode.UnknownImageUploadError)
    }
    if (typeof res === 'number') {
        return yuzuError(event, res)
    }

    await UserModel.updateOne(
        {uid: userInfo.uid},
        {$inc: {dailyImageCount: 1}}
    )
    return path.relative(process.cwd(), res)
})
