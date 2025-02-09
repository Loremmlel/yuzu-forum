import {MessageModel} from "~/server/models/message";
import {ErrorCode} from "~/code&message/errorCode";
import {ReturnMessage} from "~/code&message/returnMessage";

export default defineEventHandler(async (event) => {
    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    const uid = userInfo.uid

    const {mid}: { mid: string } = await getQuery(event)
    if (!mid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    await MessageModel.deleteOne({receiverUid: uid, mid})

    return ReturnMessage.DeleteMessage
})