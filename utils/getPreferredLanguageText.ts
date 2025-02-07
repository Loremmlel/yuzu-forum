export function getPreferredLanguageText(language: YuzuLanguage, locale: Language): string {
    const languagePriority: Record<Language, Language[]> = {
        'en-us': ['en-us', 'zh-cn', 'ja-jp'],
        'ja-jp': ['ja-jp', 'en-us', 'zh-cn'],
        'zh-cn': ['zh-cn', 'ja-jp', 'en-us']
    }
    const priorities = languagePriority[locale]
    for (const lang of priorities) {
        if (language[lang]) {
            return language[lang]
        }
    }
    return ''
}