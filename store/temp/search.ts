export const useTempSearchStore = defineStore('tempSearch', () => {
    const keywords = ref('')
    return {keywords}
}, {persist: false})