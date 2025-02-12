export const usePersistEditTopicStore = defineStore('yzforumEditTopic', () => {
    const mode = ref<'preview' | 'code'>('preview')
    const textCount = ref(0)

    const title = ref('')
    const content = ref('')
    const tags = ref<string[]>([])
    const category = ref<string[]>([])
    const section = ref<string[]>([])

    function resetTopicData() {
        textCount.value = 0

        title.value = ''
        content.value = ''
        tags.value = []
        category.value = []
        section.value = []
    }

    function reset() {
        resetTopicData()
        mode.value = 'preview'
    }

    return {
        mode,
        textCount,

        title,
        content,
        tags,
        category,
        section,

        resetTopicData,
        reset
    }
}, {persist: piniaPluginPersistedstate.localStorage()})