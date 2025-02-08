export function generateRandomCode(length: number) {
    const chars = '0123456789abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

export function generateRoomName(uid1: number, uid2: number): string {
    const sortedUids = [uid1, uid2].sort((a, b) => a - b)
    return `${sortedUids[0]}-${sortedUids[1]}`
}