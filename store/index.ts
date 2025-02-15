import {useTempPoolPageStore} from "~/store/temp/topic/pool";
import {usePersistPoolStore} from "~/store/modules/pool";
import {usePersistYzforumSearchStore} from "~/store/modules/search";
import {usePersistCategoryStore} from "~/store/modules/category";

export function yzforumStoreReset() {
    usePersistYzforumHomeStore().reset()
    usePersistSettingsStore().reset()
    usePersistUserStore().reset()
    usePersistEditTopicStore().reset()
    usePersistYzforumReplyStore().reset()
    usePersistYzforumTopicStore().reset()
    usePersistEditGameStore().reset()
    usePersistPoolStore().reset()
    usePersistYzforumSearchStore().reset()
    usePersistCategoryStore().reset()

    useTempSectionStore().reset()
    useTempBannedStore().reset()
    useTempSearchStore().reset()
    useTempRankingStore().reset()
    useTempSettingStore().reset()
    useTempGameResourceStore().reset()
    useTempEditStore().reset()
    useComponentMessageStore().reset()
    useTempReplyStore().reset()
    useTempCommentStore().reset()
    useTempGamePRStore().reset()
    useTempGameStore().reset()
    useTempPoolPageStore().reset()
}