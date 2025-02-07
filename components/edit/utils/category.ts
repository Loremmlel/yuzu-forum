export interface Category {
    index: number
    name: string
    options: string[]
}

export const gameSection = [
    'g-chatting',
    'g-article',
    'g-walkthrough',
    'g-seeking',
    'g-news',
    'g-releases',
    'g-other'
]

export const techniqueSection = [
    't-crack',
    't-languages',
    't-practical',
    't-help',
    't-linux',
    't-web',
    't-android',
    't-adobe',
    't-ai',
    't-algorithm',
    't-other'
]

export const otherSection = [
    'o-anime',
    'o-comics',
    'o-music',
    'o-novel',
    'o-essay',
    'o-daily',
    'o-forum',
    'o-patch',
    'o-other'
]

export const iconMap: Record<string, string> = {
    g: 'lucide:gamepad-2',
    t: 'lucide:drafting-compass',
    o: 'lucide:circle-ellipsis'
}

export const topicCategory: Category[] = [
    {
        index: 1,
        name: 'game',
        options: gameSection
    },
    {
        index: 2,
        name: 'technique',
        options: techniqueSection
    },
    {
        index: 3,
        name: 'other',
        options: otherSection
    }
]