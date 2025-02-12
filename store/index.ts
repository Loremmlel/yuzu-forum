import {useTempEditStore} from "~/store/temp/edit/edit";
import {usePersistEditTopicStore} from "~/store/modules/edit/edit";
import {useTempReplyStore} from "~/store/temp/topic/reply";
import {usePersistYzforumReplyStore} from "~/store/modules/topic/reply";

export function yzforumStoreReset() {
    usePersistYzforumHomeStore().reset()
    usePersistSettingsStore().reset()
    usePersistUserStore().reset()
    usePersistEditTopicStore().reset()
    usePersistYzforumReplyStore().reset()

    useTempSectionStore().reset()
    useTempBannedStore().reset()
    useTempSearchStore().reset()
    useTempRankingStore().reset()
    useTempSettingStore().reset()
    useTempGameResourceStore().reset()
    useTempEditStore().reset()
    useComponentMessageStore().reset()
    useTempReplyStore().reset()
}