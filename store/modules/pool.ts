export const usePersistPoolStore = defineStore('YzforumPool', () => {
    const layout = ref<'grid' | 'list'>('grid')

    function reset() {
        layout.value = 'grid'
    }

    return {
        layout,

        reset
    }
}, {persist: true})