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
    const uid = userInfo.uid

    const resource = await GameResourceModel.findOne({ grid })
    if (!resource) {
        return yuzuError(event, 10622)
    }
    if (resource.status === 1) {
        return yuzuError(event, 10625)
    }

    await GameResourceModel.updateOne({ grid }, { status: 1 }).lean()
    await createMessage(
        uid,
        resource.uid,
        'expired',
        resource.link[0].slice(0, 233),
        0,
        resource.gid
    )

    return '过期游戏资源成功!'
})