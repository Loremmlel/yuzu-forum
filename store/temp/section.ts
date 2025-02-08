export const useTempSectionStore = defineStore('tempSection', () => {
    const page = ref(1)
    const limit = ref(10)
    return {page, limit}
}, {persist: false})