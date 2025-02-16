export const useTempSectionStore = defineStore('tempSection', () => {
    const page = ref(1)
    const limit = ref(10)

    function reset() {
        page.value = 1
        limit.value = 10
    }

    return {page, limit, reset}
}, {persist: false})