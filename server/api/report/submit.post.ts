import {yuzuError} from "~/server/utils/YuzuError"
import {ReportSubmitRequestData} from "~/types/api/report"
import {getCookieTokenInfo} from "~/server/utils/getCokkieTokenInfo"
import {reportSection} from "~/pages/report/constant"
import {ReportModel} from "~/server/models/report"
import {ErrorCode} from "~/code&message/errorCode";

export default defineEventHandler(async (event) => {
    const {reason, type}: ReportSubmitRequestData = await readBody(event)

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, ErrorCode.LoginExpired, 205)
    }
    if (!reportSection.includes(type)) {
        return yuzuError(event, ErrorCode.InvalidReportType)
    }
    if (!reason) {
        return yuzuError(event, ErrorCode.EmptyReportReason)
    }
    if (reason.trim().length > 1007) {
        return yuzuError(event, ErrorCode.ReportContentTooLong)
    }
    await ReportModel.create({reason, type})
    return '提交反馈成功!'
})