export function isDeepEmpty(obj: any): boolean {
    if (obj == null) {
        return true
    }
    if (typeof obj !== 'object') {
        return false
    }

    if (Array.isArray(obj)) {
        return obj.every(element => isDeepEmpty(element) || element === '')
    }

    if (obj instanceof Map || obj instanceof Set) {
        return obj.size === 0
    }

    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            if (!isDeepEmpty(obj[key])) {
                return false
            }
        }
    }
    return true
}