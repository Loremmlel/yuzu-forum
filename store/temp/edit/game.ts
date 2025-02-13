import type {GameStoreTemp} from "~/store/types/edit/game";

export const useTempGamePRStore = defineStore('tempGamePR', () => {
    const gamePR = ref<GameStoreTemp[]>([])

    function reset() {
        gamePR.value = []
    }

    return {
        gamePR,

        reset
    }
}, {persist: false})