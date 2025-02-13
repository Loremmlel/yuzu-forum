import fs from "node:fs";
import path from "node:path";

export async function saveImage(file: Buffer, bucketName: string, filename: string) {
    const dataPath = path.join(process.cwd(), 'public', 'data', bucketName)
    if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, {recursive: true})
    }
    const filePath = path.join(dataPath, filename)
    try {
        fs.writeFileSync(filePath, file)
        return filePath
    } catch (err) {
        console.error('写入图片错误:', err)
        return false
    }
}
