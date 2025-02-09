import {UserModel} from "~/server/models/user";
import {isValidName} from "~/utils/validate";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";


export default defineEventHandler(async (event) => {
    const {username}: { username: string } = await readBody(event)

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    if (!isValidName(username)) {
        return yuzuError(event, ErrorCode.InvalidUsernameUpdate)
    }
    const user = await UserModel.findOne({uid: userInfo.uid})
    if (!user) {
        return yuzuError(event, ErrorCode.UserNotFound)
    }
    if (user.point < 1017) {
        return yuzuError(event, ErrorCode.InsufficientPoints)
    }
    const duplicated = await UserModel.countDocuments({
        name: {$regex: new RegExp(`^${username}$`, 'i')}
    })
    if (duplicated) {
        return yuzuError(event, ErrorCode.UsernameAlreadyRegistered)
    }
    await UserModel.updateOne(
        {uid: userInfo.uid},
        {$set: {name: username}, $inc: {point: -17}}
    )
    return ReturnMessage.UpdateUsername
})