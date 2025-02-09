export const useRandomSticker = computed(() => {
    const randomPackIndex = randomNum(1, 5)
    const randomStickerIndex = randomNum(1, 80)
    return `sticker/${randomPackIndex}/${randomStickerIndex}`
})