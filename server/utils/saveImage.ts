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
    return cos.getObjectUrl({
        Bucket: config.BUCKET_NAME,
        Region: config.BUCKET_REGION,
        Key: filenameWithBucket,
        Sign: true
    }, (err, data) => {
        if (err) {
            console.log('图片获取失败', filenameWithBucket)
        } else {
            return data.Url
        }
    })
}
