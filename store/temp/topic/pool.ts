export const useTempPoolPageStore = defineStore('PoolPage', () => {
    const page = ref(1)
    const limit = ref(24)
    const sortField = ref<'created' | 'views'>('created')
    const sortOrder = ref<YuzuOrder>('desc')
    const category = ref<'all' | 'game' | 'technique' | 'other'>('all')

    function reset() {
        page.value = 1
        limit.value = 24
        sortField.value = 'created'
        sortOrder.value = 'desc'
        category.value = 'all'
    }

    function data() {
        return reactive({
            page: page.value,
            limit: limit.value,
            sortField: sortField.value,
            sortOrder: sortOrder.value,
            category: category.value
        })
    }

    return {
        page,
        limit,
        sortField,
        sortOrder,
        category,

        reset,
        data
    }
})