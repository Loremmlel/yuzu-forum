import {render} from "vue";
import type {InfoCode} from "~/code&message/infoCode";
import {getInfoMessagesCN, getInfoMessagesJP} from "~/code&message/infoMessage";


type MessageType = 'warn' | 'success' | 'error' | 'info'
const messageCount = ref(0)

export function useMessage(
    messageData: InfoCode | YuzuLanguage,
    type: MessageType,
    duration?: number,
    richText?: boolean
) {
    let timeout: NodeJS.Timeout | null = null
    let message: YuzuLanguage

    messageCount.value++
    render(null, document.body)

    if (typeof messageData === 'number') {
        message = {
            'en-us': getInfoMessagesCN(messageData),
            'ja-jp': getInfoMessagesJP(messageData),
            'zh-cn': getInfoMessagesCN(messageData)
        }
    } else {
        message = messageData
    }
}