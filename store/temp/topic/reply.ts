import type {TopicReply} from "~/types/api/topicReply";

export const useTempReplyStore = defineStore('tempTopicReply', () => {
    const textCount = ref(0)
    const isEdit = ref(false)
    const isScrollToTop = ref(false)
    const scrollToReplyId = ref(-1)
    const isReplyRewriting = ref(false)

    const replyRewrite = ref<TopicReply[]>([])
    const tempReply = ref<TopicReply[]>([])

    function resetRewriteReplyData() {
        replyRewrite.value = []
        isReplyRewriting.value = false
    }

    function reset() {
        resetRewriteReplyData()
        textCount.value = 0
        isEdit.value = false
        isScrollToTop.value = false
        scrollToReplyId.value = -1
        tempReply.value = []
    }

    return {
        textCount,
        isEdit,
        isScrollToTop,
        scrollToReplyId,
        isReplyRewriting,
        replyRewrite,
        tempReply,
        resetRewriteReplyData,
        reset
    }
}, {persist: false})