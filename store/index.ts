import {usePersistEditGameStore} from "~/store/modules/edit/game";
import {useTempGameStore} from "~/store/temp/game/game";

export function yzforumStoreReset() {
    usePersistYzforumHomeStore().reset()
    usePersistSettingsStore().reset()
    usePersistUserStore().reset()
    usePersistEditTopicStore().reset()
    usePersistYzforumReplyStore().reset()
    usePersistYzforumTopicStore().reset()
    usePersistEditGameStore().reset()

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
}