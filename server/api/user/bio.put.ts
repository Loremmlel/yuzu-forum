import {UserModel} from "~/server/models/user";

export default defineEventHandler(async (event) => {
    const { bio }: { bio: string } = await readBody(event)
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    if (bio.length > 100) {
        return yuzuError(event, 10106)
    }
    await UserModel.updateOne({ uid: userInfo.uid }, { $set: { bio } })
    return '更新bio成功!'
})