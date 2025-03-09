import COS from 'cos-nodejs-sdk-v5'

export async function saveImage(file: Buffer, bucketName: string, filename: string) {
    const config = useRuntimeConfig()
    const cos = new COS({
        SecretId: config.CLOUD_SECRET_ID,
        SecretKey: config.CLOUD_SECRET_KEY
    })
    const filenameWithBucket = `${bucketName}/${filename}`.replace(/\//g, '-')
    cos.putObject({
        Bucket: config.BUCKET_NAME,
        Region: config.BUCKET_REGION,
        Key: filenameWithBucket,
        Body: file
    }, (err, _data) => {
        if (err) {
            console.log('图片上传失败', filenameWithBucket)
        }
    })
    // fix: 修复了图片URL不是永久有效的问题
    // tips: 使用cos.getObjectUrl()方法获取的URL，是临时的
    return `https://${config.BUCKET_NAME}.cos.${config.BUCKET_REGION}.myqcloud.com/${filenameWithBucket}`
}
