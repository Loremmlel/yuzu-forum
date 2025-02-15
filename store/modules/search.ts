export const usePersistYzforumSearchStore = defineStore('YzforumSearch', () => {
    const searchHistory = ref<string[]>([])

    function reset() {
        searchHistory.value = []
    }

    return {
        searchHistory,

        reset
    }
}, {persist: true})