import type {FetchContext, FetchResponse} from "ofetch";
import Cookies from "js-cookie";
import {InfoCode} from "~/code&message/infoCode";
import {yzforumErrorHandler} from "~/utils/errorHandler";
import {ErrorCode} from "~/code&message/errorCode";

interface ResponseMap {
    blob: Blob
    text: string
    arrayBuffer: ArrayBuffer
    stream: ReadableStream<Uint8Array>
}

type ResponseType = keyof ResponseMap | 'json'

type YuzuOnResponseContext = FetchContext<any, ResponseType> & {
    response: FetchResponse<ResponseType>
}

type YuzuOnResponseErrorContext<R extends ResponseType = 'json'> = FetchContext & {
    response: FetchResponse<R>
}

export function onResponse(context: YuzuOnResponseContext) {
    if (context.response.status === 205) {
        const navigateCookie = Cookies.get('yzforum-is-navigate-to-login')
        if (!navigateCookie) {
            usePersistUserStore().reset()
            useMessage(InfoCode.LoginExpired, 'error', 8888)

            const nuxt = useNuxtApp()
            navigateTo(nuxt.$localePath('/login'))
            Cookies.set('yzforum-is-navigate-to-login', 'navigated')
            return
        }
    }

    if (context.response.status === 233) {
        yzforumErrorHandler(Number(context.response.headers.get('Yuzu-Error')) ?? ErrorCode.NoError)
    }
}

function onResponseError(context: YuzuOnResponseErrorContext) {

}

export const yzforumResponseHandler = {onResponse, onResponseError}