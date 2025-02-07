export function findFirstNonNullProperty<T>(obj: T): T[keyof T] | '' {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) &&
            obj[key] !== '' &&
            obj[key] != null) {
            return obj[key]
        }
    }
    return ''
}