import {H3Event} from "h3";
import {ErrorCode} from "~/code&message/errorCode";

export const yuzuError = (event: H3Event, code: ErrorCode, errorCode?: number) => {
    event.node.res.statusCode = errorCode ?? 233
    event.node.res.setHeader('Yuzu-Error', code.toString())
}