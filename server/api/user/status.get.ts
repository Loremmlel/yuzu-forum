import {HomeUserStatus} from "~/types/api/home";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }

    const user = await UserModel.findOne(
        {uid: userInfo.uid},
        {point: 1, dailyCheckIn: 1, _id: 0}
    )
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    return {
        points: user.point,
        isCheckIn: user.dailyCheckIn === 1
    } as HomeUserStatus
})