import type {ShallowRef} from "vue";
import {Ctx} from "@milkdown/ctx";

export interface EditStorePersist {
    mode: 'preview' | 'code'
    textCount: number

    title: string
    content: string
    tags: string[]
    category: string[]
    section: string[]
}

export interface EditStoreTemp {
    tid: number
    title: string
    content: string
    tags: string[]
    category: string[]
    section: string[]

    textCount: number
    isTopicRewriting: boolean
    autosaveCount: number

    editorContext: ShallowRef<Ctx | null>
}