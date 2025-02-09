import {getErrorMessageCN, getErrorMessageEN, getErrorMessageJP} from "~/code&message/errorMessage";
import type {ErrorCode} from "~/code&message/errorCode";

function showMessage(errorCode: ErrorCode) {
    const messageType = 'error'
    const message = {
        'en-us': getErrorMessageEN(errorCode),
        'ja-jp': getErrorMessageJP(errorCode),
        'zh-cn': getErrorMessageCN(errorCode),
    }
    useMessage(message, messageType, 5000)
}

export function yzforumErrorHandler(errorCode: ErrorCode) {
    showMessage(errorCode)
}