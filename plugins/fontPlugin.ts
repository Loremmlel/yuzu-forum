export default defineNuxtPlugin(() => {
    const setting = usePersistSettingsStore()
    if (import.meta.client) {
        document.documentElement.style.setProperty('--font-family', setting.showYzforumFontStyle)
    }
})