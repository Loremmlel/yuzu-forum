import type {LanguageOptions, PlatformOptions, TypeOptions} from "~/components/game/utils/option";

export const useTempGameStore = defineStore('tempGame', () => {
    const page = ref(1)
    const limit = ref(24)
    const type = ref<TypeOptions>('all')
    const language = ref<LanguageOptions>('all')
    const platform = ref<PlatformOptions>('all')
    const sortField = ref<'time' | 'created' | 'views'>('time')
    const sortOrder = ref<YuzuOrder>('desc')

    function reset() {
        page.value = 1
        limit.value = 24
        type.value = 'all'
        language.value = 'all'
        platform.value = 'all'
        sortField.value = 'time'
        sortOrder.value = 'desc'
    }

    function out() {
        return {
            page: page.value,
            limit: limit.value,
            type: type.value,
            language: language.value,
            platform: platform.value,
            sortField: sortField.value,
            sortOrder: sortOrder.value
        }
    }

    return {
        page,
        limit,
        type,
        language,
        platform,
        sortField,
        sortOrder,

        reset,
        out
    }
}, {persist: false})