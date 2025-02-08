interface _DiffObject {
    [key: string]: any
}

type AnyObject = _DiffObject

export function compareObjects(obj1: _DiffObject, obj2: _DiffObject): _DiffObject {
    const diff: _DiffObject = {}

    function traverse(curObj1: _DiffObject, curObj2: _DiffObject, curDiff: _DiffObject, path: string[] = []) {
        for (const key in curObj1) {
            const newPath = [...path, key]
            if (!(key in curObj2)) {
                curDiff[key] = curObj1[key]
            } else if (
                typeof curObj1[key] === 'object' && curObj1[key] !== null
                && typeof curObj2[key] === 'object' && curObj2[key] !== null
            ) {
                if (Array.isArray(curObj1[key]) && Array.isArray(curObj2[key])) {
                    if (JSON.stringify(curObj1[key]) !== JSON.stringify(curObj2[key])) {
                        curDiff[key] = curObj1[key]
                    }
                } else {
                    curDiff[key] = {}
                    traverse(curObj1[key], curObj2[key], curDiff[key], newPath)
                    if (Object.keys(curDiff[key]).length === 0) {
                        delete curDiff[key]
                    }
                }
            } else if (curObj1[key] !== curObj2[key]) {
                curDiff[key] = curObj1[key]
            }
        }
    }

    traverse(obj1, obj2, diff)
    return diff
}

export function mergeLanguages(lang1: YuzuLanguage, lang2: Partial<YuzuLanguage>): YuzuLanguage {
    const mergedLang: YuzuLanguage = {...lang1}
    Object.keys(lang2).forEach(key => {
        if (lang2[key as keyof YuzuLanguage] !== undefined) {
            mergedLang[key as keyof YuzuLanguage] = lang2[key as keyof YuzuLanguage]!
        }
    })
    return mergedLang
}

export function deepMergeObjects<T extends AnyObject>(...objects: T[]): T {
    const isObject = (obj: any) => obj && typeof obj === 'object'
    return objects.reduce((acc, obj) => {
        Object.keys(obj).forEach(key => {
            const oldValue = acc[key]
            const newValue = obj[key]
            if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                acc[key] = [...oldValue, ...newValue]
            } else if (isObject(oldValue) && isObject(newValue)) {
                acc[key] = deepMergeObjects(oldValue, newValue)
            } else {
                acc[key] = newValue
            }
        })
        return acc
    }, {} as AnyObject) as T
}