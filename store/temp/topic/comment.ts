export const useTempCommentStore = defineStore('tempTopicComment', () => {
    const rid = ref(0)
    const toUid = ref(0)
    const toUsername = ref('')
    const content = ref('')

    const showPanel = ref(false)

    function reset() {
        rid.value = 0
        toUid.value = 0
        toUsername.value = ''
        content.value = ''
        showPanel.value = false
    }

    return {
        rid,
        toUid,
        toUsername,
        content,
        showPanel,

        reset
    }
}, {persist: false})