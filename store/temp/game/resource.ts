import type {GameResourceStoreTemp} from "~/store/types/game/resource";

export const useTempGameResourceStore = defineStore('tempGameResource', () => {
    const resources = ref<GameResourceStoreTemp[]>([])
    const showPublish = ref(false)
    const rewriteResourceId = ref(0)
    const commentToUid = ref(0)

    function reset() {
        resources.value = []
        showPublish.value = false
        rewriteResourceId.value = 0
        commentToUid.value = 0
    }

    return {resources, showPublish, rewriteResourceId, commentToUid, reset}
}, {persist: false})