import {UserModel} from "~/server/models/user";
import {randomNum} from "~/utils/random";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    const user = await UserModel.findOne({ uid: userInfo.uid })
    if (!user) {
        return yuzuError(event, 10101)
    }
    if (user.dailyCheckIn) {
        return yuzuError(event, 10119)
    }
    const randomPoints = randomNum(0, 7)
    await UserModel.updateOne(
        { uid: userInfo.uid },
        { $inc: { point: randomPoints }, $set: { dailyCheckIn: 1 } }
    )
    return randomPoints
})