export function decodeIfEncoded(text: string) {
    try {
        const decoded = decodeURIComponent(text)
        return decoded !== text ? decoded : text
    } catch (e) {
        return text
    }
}