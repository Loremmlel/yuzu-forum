interface BannedLogStore {
    page: string
    limit: string
}

export const useTempBannedStore = defineStore('tempBanned', () => {
    const page = ref('1')
    const limit = ref('4')
    return {page, limit}
}, {persist: false})