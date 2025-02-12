export function yzforumStoreReset() {
    usePersistYzforumHomeStore().reset()
    usePersistSettingsStore().reset()
    usePersistUserStore().reset()

    useTempSectionStore().reset()
    useTempBannedStore().reset()
    useTempSearchStore().reset()
    useTempRankingStore().reset()
    useTempSettingStore().reset()
    useTempGameResourceStore().reset()
    useComponentMessageStore().reset()
}