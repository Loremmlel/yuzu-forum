import {dataURItoBlob} from "~/utils/dataURItoBlob";
import {InfoCode} from "~/code&message/infoCode";

export function resizeImage(file: File, width: number, height: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = URL.createObjectURL(file)
        image.onload = () => {
            let newWidth = image.width
            let newHeight = image.height

            // 仅在原始尺寸超过限制时进行调整
            if (image.width > width || image.height > height) {
                const aspectRatio = image.width / image.height
                // 根据宽高比决定缩放基准
                if (aspectRatio > 1) {
                    newWidth = width
                    newHeight = newWidth / aspectRatio
                } else {
                    newHeight = height
                    newWidth = newHeight * aspectRatio
                }
            }

            // 使用canvas进行实际缩放操作
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = newWidth
            canvas.height = newHeight

            ctx?.drawImage(image, 0, 0, newWidth, newHeight)
            const resizedFile = dataURItoBlob(canvas.toDataURL('image/webp', 0.8))

            if (resizedFile.size > 1024 * 1024) {
                useMessage(InfoCode.FileSizeExceeded, 'warn')
                reject(new Error('Image is too large.'))
            } else {
                resolve(resizedFile)
            }
        }
    })
}