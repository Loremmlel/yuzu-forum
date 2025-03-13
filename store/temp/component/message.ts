export const useComponentMessageStore = defineStore('tempComponentMessage', () => {
    const showInfo = ref(false)
    const infoMessage = ref('')
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

    let promiseResolve: ((value: boolean) => void) | null = null

    function info(infoMessage_: string, durations_?: number) {
        infoMessage.value = infoMessage_
        durations.value = durations_ ?? 3000
        showInfo.value = true
    }

    function alert(alertTitle_?: YuzuLanguage, alertMessage_?: YuzuLanguage, showCancel_?: boolean) {
        return new Promise<boolean>((resolve) => {
            promiseResolve = resolve
            showAlert.value = true
            if (alertTitle_) {
                alertTitle.value = alertTitle_
            }
            if (alertMessage_) {
                alertMessage.value = alertMessage_
            }
            if (showCancel_) {
                showCancel.value = showCancel_
            }
            showAlert.value = true
        })
    }

    function setPass() {
        isCheckPass.value = true
        setTimeout(() => {
            isCheckPass.value = false
        }, 500)
    }

    function handleClose() {
        promiseResolve?.(false)
        promiseResolve = null
    }

    function handleConfirm() {
        promiseResolve?.(true)
        promiseResolve = null
    }

    function reset() {
        showInfo.value = false
        infoMessage.value = ''
        durations.value = 0

        showAlert.value = false
        alertTitle.value = {
            'en-us': '',
            'ja-jp': '',
            'zh-cn': ''
        }
        alertMessage.value = {
            'en-us': '',
            'ja-jp': '',
            'zh-cn': ''
        }
        showCancel.value = false
        isCheckPass.value = false

        promiseResolve = null

    }

    return {
        showInfo,
        infoMessage,
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
        setPass,
        reset
    }
}, {persist: false})