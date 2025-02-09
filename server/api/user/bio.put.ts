import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

export default defineEventHandler(async (event) => {
    const {bio}: { bio: string } = await readBody(event)
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    if (bio.length > 100) {
        return yuzuError(event, ErrorCode.UserSignatureTooLong)
    }
    await UserModel.updateOne({uid: userInfo.uid}, {$set: {bio}})
    return ReturnMessage.UpdateBio
})