export const useTempSettingStore = defineStore('tempSetting', () => {
    const showYuzuGameHamburger = ref(false)
    const showYuzuGamePanel = ref(false)
    const showYuzuGameUserPanel = ref(false)
    const showYuzuGameMessageBox = ref(false)

    function reset() {
        showYuzuGameHamburger.value = false
        showYuzuGamePanel.value = false
        showYuzuGameUserPanel.value = false
        showYuzuGameMessageBox.value = false
    }

    return {showYuzuGameHamburger, showYuzuGamePanel, showYuzuGameUserPanel, showYuzuGameMessageBox, reset}
}, {persist: false})