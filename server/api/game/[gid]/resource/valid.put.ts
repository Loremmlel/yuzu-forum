import {GameResourceModel} from "~/server/models/gameResource";

export default defineEventHandler(async (event) => {
    const { grid }: { grid: string } = await getQuery(event)
    if (!grid) {
        return yuzuError(event, 10507)
    }

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }

    const resource = await GameResourceModel.findOne({ grid })
    if (!resource) {
        return yuzuError(event, 10622)
    }
    if (resource.uid !== userInfo.uid) {
        return yuzuError(event, 10623)
    }

    await GameResourceModel.updateOne({ grid }, { status: 0 }).lean()

    return '有效游戏资源成功!'
})