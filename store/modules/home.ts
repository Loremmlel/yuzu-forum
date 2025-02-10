export const usePersistYzforumHomeStore = defineStore('yzforumHome', () => {
    const fold = ref({
        updates: true,
        topics: true,
        games: true,
        resources: true,
        sitemaps: true
    })

    return {fold}
}, {persist: true})