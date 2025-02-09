import sharp from "sharp";
import {ErrorCode} from "~/code&message/errorCode";

export async function saveGameBanner(
    bannerBuffer: ArrayBuffer | Buffer,
    gid: number
) {
    const banner = await sharp(bannerBuffer).toBuffer()
    const miniBanner = await sharp(bannerBuffer)
        .resize(460, 260, {
            fit: 'contain',
            background: {r: 0, g: 0, b: 0, alpha: 0}
        })
        .webp({quality: 78})
        .toBuffer()
    if (!checkBufferSize(miniBanner, 1.007)) {
        return ErrorCode.PreviewImageSizeExceeded
    }

    const bucketName = `image/game/${gid}/banner`
    const url = await saveImage(banner, bucketName, 'banner.webp')
    const miniUrl = await saveImage(miniBanner, bucketName, 'banner-mini.webp')
    if (!miniUrl || !url) {
        return false
    }
    return {url, miniUrl}
}