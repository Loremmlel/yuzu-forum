export const useTempSearchStore = defineStore('tempSearch', () => {
    const keywords = ref('')

    function reset() {
        keywords.value = ''
    }

    return {keywords, reset}
}, {persist: false})