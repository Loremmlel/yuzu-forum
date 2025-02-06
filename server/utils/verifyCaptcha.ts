export async function verifyCaptcha(email: string, userProvidedCode: string): Promise<boolean> {
    const storedCode = await useStorage('redis').getItem(email)
    if (!storedCode) {
        return false
    }
    return storedCode === userProvidedCode
}