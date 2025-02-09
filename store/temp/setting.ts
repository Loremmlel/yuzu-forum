import type {MessageStatus} from "~/types/utils/message";

export const useTempSettingStore = defineStore('tempSetting', () => {
    const showYzforumHamburger = ref(false)
    const showYzforumPanel = ref(false)
    const showYzforumUserPanel = ref(false)
    const showYzforumMessageBox = ref(false)
    const messageStatus: Ref<MessageStatus> = ref('offline')

    function reset() {
        showYzforumHamburger.value = false
        showYzforumPanel.value = false
        showYzforumUserPanel.value = false
        showYzforumMessageBox.value = false
    }

    return {showYzforumHamburger, showYzforumPanel, showYzforumUserPanel, showYzforumMessageBox, messageStatus, reset}
}, {persist: false})