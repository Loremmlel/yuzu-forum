export const usePersistCategoryStore = defineStore('YzforumCategory', () => {
    const category = ref<'game' | 'technique' | 'other'>('game')

    function reset() {
        category.value = 'game'
    }

    return {
        category,
        reset
    }
}, {persist: true})