import {UserModel} from "~/server/models/user";
import {randomNum} from "~/utils/random";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const user = await UserModel.findOne({uid: userInfo.uid})
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    if (user.dailyCheckIn) {
        return yuzuError(event, ErrorCode.AlreadyCheckedInToday)
    }
    const randomPoints = randomNum(0, 7)
    await UserModel.updateOne(
        {uid: userInfo.uid},
        {$inc: {point: randomPoints}, $set: {dailyCheckIn: 1}}
    )
    return randomPoints
})