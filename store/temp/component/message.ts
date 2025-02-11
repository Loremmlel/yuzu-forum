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
    const isCheckPass = ref(false)

    let handleClose = () => {}
    let handleConfirm = () => {}

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

            handleClose = () => resolve(false)
            handleConfirm = () => resolve(true)
        })
    }

    function setPass() {
        isCheckPass.value = true
        setTimeout(() => {
            isCheckPass.value = false
        }, 500)
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
        handleClose,
        handleConfirm,
        info,
        alert,
        isCheckPass,
        setPass
    }
}, {persist: false})