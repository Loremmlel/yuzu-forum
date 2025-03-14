import type {PoolTopic} from "~/types/api/pool";

export const useTempPoolPageStore = defineStore('PoolPage', () => {
    const page = ref(1)
    const limit = ref(24)
    const sortField = ref<'created' | 'views'>('created')
    const sortOrder = ref<YuzuOrder>('desc')
    const category = ref<'all' | 'game' | 'technique' | 'other'>('all')
    // 缓存已获取的 topics
    // fix: 防止用户回退时数据消失，特别是划到最后一页的情况下，因为给滚动加了监听，所以此时page++，但是请求的topics是空的，导致数据消失
    const topics = ref<PoolTopic[]>([])
    const loadingComplete = ref(false)

    function reset() {
        page.value = 1
        limit.value = 24
        sortField.value = 'created'
        sortOrder.value = 'desc'
        category.value = 'all'
        topics.value = []
        loadingComplete.value = false
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
        topics,
        loadingComplete,

        reset,
        data
    }
})