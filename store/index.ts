import {useTempSectionStore} from "~/store/temp/section";
import {useTempBannedStore} from "~/store/temp/banned";
import {useTempSearchStore} from "~/store/temp/search";
import {useTempRankingStore} from "~/store/temp/ranking";
import {useTempSettingStore} from "~/store/temp/settings";

export function yzforumStoreReset() {
    useTempSectionStore().$reset()
    useTempBannedStore().$reset()
    useTempSearchStore().$reset()
    useTempRankingStore().$reset()
    useTempSettingStore().$reset()
}