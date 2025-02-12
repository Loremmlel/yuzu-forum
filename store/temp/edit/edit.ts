import type {Ctx} from "@milkdown/ctx";

export const useTempEditStore = defineStore('tempEdit', () => {
    const tid = ref(0)
    const title = ref('')
    const content = ref('')
    const tags = ref<string[]>([])
    const category = ref<string[]>([])
    const section = ref<string[]>([])

    const textCount = ref(0)
    const isTopicRewriting = ref(false)
    const autosaveCount = ref(0)

    const editorContext = shallowRef<Ctx | null>(null)

    function resetRewriteTopicData() {
        tid.value = 0
        title.value = ''
        content.value = ''
        tags.value = []
        category.value = []
        section.value = []

        textCount.value = 0
        isTopicRewriting.value = false
        autosaveCount.value = 0
    }

    function reset() {
        resetRewriteTopicData()
        editorContext.value = null
    }

    return {
        tid,
        title,
        content,
        tags,
        category,
        section,

        textCount,
        isTopicRewriting,
        autosaveCount,

        editorContext,

        resetRewriteTopicData,
        reset
    }
}, {persist: false})