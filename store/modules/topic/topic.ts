export const usePersistYzforumTopicStore = defineStore('YzforumTopic', () => {
    const showAdvance = ref(false)
    const activeAside = ref(false)

    function reset() {
        showAdvance.value = false
        activeAside.value = false
    }

    return {showAdvance, activeAside, reset}
}, {persist: true})