export const usePersistEditGameStore = defineStore('YzforumEditGame', () => {
    const name = ref<YuzuLanguage>({
        'en-us': '',
        'ja-jp': '',
        'zh-cn': ''
    })
    const introduction = ref<YuzuLanguage>({
        'en-us': '',
        'ja-jp': '',
        'zh-cn': ''
    })
    const aliases = ref<string[]>([])

    function reset() {
        name.value = {
            'en-us': '',
            'ja-jp': '',
            'zh-cn': ''
        }
        introduction.value = {
            'en-us': '',
            'ja-jp': '',
            'zh-cn': ''
        }
        aliases.value = []
    }

    return {
        name,
        introduction,
        aliases,

        reset
    }
}, {persist: piniaPluginPersistedstate.localStorage()})