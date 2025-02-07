import {yuzuError} from "~/server/utils/YuzuError"
import {ReportSubmitRequestData} from "~/types/api/report"
import {getCookieTokenInfo} from "~/server/utils/getCokkieTokenInfo"
import {reportSection} from "~/pages/report/constant"
import {ReportModel} from "~/server/models/report"

export default defineEventHandler(async (event) => {
    const {reason, type}: ReportSubmitRequestData = await readBody(event)

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    if (!reportSection.includes(type)) {
        return yuzuError(event, 10121)
    }
    if (!reason) {
        return yuzuError(event, 10122)
    }
    if (reason.trim().length > 1007) {
        return yuzuError(event, 10123)
    }
    await ReportModel.create({reason, type})
    return '提交反馈成功!'
})