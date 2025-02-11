import {render, h} from "vue";
import type {InfoCode} from "~/code&message/infoCode";
import {getInfoMessagesCN, getInfoMessagesEN, getInfoMessagesJP} from "~/code&message/infoMessage";
import Message from "~/components/yuzu/alert/Message.vue";


type MessageType = 'warn' | 'success' | 'error' | 'info'
const messageCount = ref(0)

export function useMessage(
    messageData: InfoCode | YuzuLanguage,
    type: MessageType,
    duration?: number,
    richText?: boolean
) {
    // let timeout: NodeJS.Timeout | null = null
    let message: YuzuLanguage

    messageCount.value++
    render(null, document.body)

    if (typeof messageData === 'number') {
        message = {
            'en-us': getInfoMessagesEN(messageData),
            'ja-jp': getInfoMessagesJP(messageData),
            'zh-cn': getInfoMessagesCN(messageData)
        }
    } else {
        message = messageData
    }

    const messageNode = h(Message, {message, type, richText})
    // const time = duration ?? 3000
    // if (timeout) {
    //     clearTimeout(timeout)
    // }
    // timeout = setTimeout(() => {
    //     messageCount.value--
    //     if (messageCount.value === 0) {
    //         render(null, document.body)
    //     }
    // }, time)
    render(messageNode, document.body)
}