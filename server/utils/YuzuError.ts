import {H3Event} from "h3";

export const yuzuError = (event: H3Event, code: number, errorCode?: number) => {
    event.node.res.statusCode = errorCode ?? 233
    event.node.res.setHeader('Yuzu-Error', code.toString())
}