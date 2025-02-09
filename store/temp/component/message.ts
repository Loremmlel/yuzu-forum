export const useComponentMessageStore = defineStore('tempComponentMessage', () => {
    const showInfo = ref(false)
    const infoMessage = ref('')
    const infoTranslateParams = ref('')
    const durations = ref(0)

    const showAlert = ref(false)
    const alertTitle: Ref<YuzuLanguage> = ref({
        'en-us': '',
        'ja-jp': '',
        'zh-cn': ''
    })
    const alertMessage: Ref<YuzuLanguage> = ref({
        'en-us': '',
        'ja-jp': '',
        'zh-cn': ''
    })
    const showCancel = ref(false)
    const showCapture = ref(false)
    const isCaptureSuccessful = ref(false)

    const handleClose: Ref<() => void> = ref(() => {})
    const handleConfirm: Ref<() => void> = ref(() => {})

    function info(infoMessage_: string, infoTranslateParams_?: string, durations_?: number) {
        infoMessage.value = infoMessage_
        infoTranslateParams.value = infoTranslateParams_ ?? ''
        durations.value = durations_ ?? 3000
        showInfo.value = true
    }

    function alert(alertTitle_?: YuzuLanguage, alertMessage_?: YuzuLanguage, shouCancel_?: boolean) {
        return new Promise<boolean>((resolve) => {
            showAlert.value = true
            if (alertTitle_) {
                alertTitle.value = alertTitle_
            }
            if (alertMessage_) {
                alertMessage.value = alertMessage_
            }
            if (shouCancel_) {
                showCancel.value = shouCancel_
            }
            showAlert.value = true

            handleClose.value = () => resolve(false)
            handleConfirm.value = () => resolve(true)
        })
    }

    return {
        showInfo,
        infoMessage,
        infoTranslateParams,
        durations,
        showAlert,
        alertTitle,
        alertMessage,
        showCancel,
        showCapture,
        isCaptureSuccessful,
        handleClose,
        handleConfirm,
        info,
        alert}
}, {persist: false})