import {useTempCommentStore} from "~/store/temp/topic/comment";

export function yzforumStoreReset() {
    usePersistYzforumHomeStore().reset()
    usePersistSettingsStore().reset()
    usePersistUserStore().reset()
    usePersistEditTopicStore().reset()
    usePersistYzforumReplyStore().reset()
    usePersistYzforumTopicStore().reset()

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
}