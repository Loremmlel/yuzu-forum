export const usePersistYzforumReplyStore = defineStore('YzforumTopicReply', () => {
    const mode = ref<'preview' | 'code'>('preview')
    const textCount = ref(0)

    const replyDraft = reactive<{
        toUsername: string,
        toUid: number,
        content: string,
        tags: string[],
        toFloor: number
    }>({
        toUsername: '',
        toUid: 0,
        content: '',
        tags: [],
        toFloor: 0
    })

    function resetReplyDraft() {
        textCount.value = 0

        replyDraft.toUsername = ''
        replyDraft.toUid = 0
        replyDraft.content = ''
        replyDraft.tags = []
        replyDraft.toFloor = 0
    }

    function resetReplyContent() {
        textCount.value = 0

        replyDraft.content = ''
        replyDraft.tags = []
    }

    function reset() {
        resetReplyDraft()
        mode.value = 'preview'
    }

    return {
        mode,
        textCount,

        replyDraft,

        resetReplyDraft,
        resetReplyContent,
        reset
    }
}, {persist: true})