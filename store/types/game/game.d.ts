import type {LanguageOptions, PlatformOptions, TypeOptions} from "~/components/game/utils/option";

export interface GameStoreTemp {
    page: number
    limit: number
    type: TypeOptions
    language: LanguageOptions
    platform: PlatformOptions
    sortField: 'time' | 'created' | 'views'
    sortOrder: YuzuOrder
}