import type {GameResourceStoreTemp} from "~/store/types/game/resource";

export const useTempGameResourceStore = defineStore('tempGameResource', () => {
    const resources = ref<GameResourceStoreTemp>()
    const showPublish = ref(false)
    const rewriteResourceId = ref(0)
    const commentToUid = ref(0)

    return {resources, showPublish, rewriteResourceId, commentToUid}
}, {persist: false})