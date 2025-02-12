import type {RankingGetTopicsRequestData, RankingGetUserRequestData} from "~/types/api/ranking";

export const useTempRankingStore = defineStore('tempRanking', () => {
    const topicRequestData: Ref<RankingGetTopicsRequestData> = ref({
        page: '1',
        limit: '30',
        sortField: 'views',
        sortOrder: 'desc'
    })
    const userRequestData: Ref<RankingGetUserRequestData> = ref({
        page: '1',
        limit: '30',
        sortField: 'point',
        sortOrder: 'desc'
    })

    function reset() {
        topicRequestData.value = {
            page: '1',
            limit: '30',
            sortField: 'views',
            sortOrder: 'desc'
        }
        userRequestData.value = {
            page: '1',
            limit: '30',
            sortField: 'point',
            sortOrder: 'desc'
        }
    }

    return {topicRequestData, userRequestData, reset}
}, {persist: false})