export function checkComment(content: string) {
    if (!content.trim() || content.trim().length > 1000) {
        return 10223
    }
    return 0
}