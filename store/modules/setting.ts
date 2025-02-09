import {deleteImage, getImage, saveImage} from "~/composables/useLocalforage";
import {yzforumStoreReset} from "~/store";

const settingsCustomBackgroundImageName = 'yzforum-custom-bg'
const settingsPublishBannerImageName = 'yzforum-publish-banner'
const settingsDefaultFontFamily = 'system-ui'

export const usePersistSettingsStore = defineStore('yzforumSettings', () => {
    const showYzforumPageTransparency = ref(77)
    const showYzforumFontStyle = ref(settingsDefaultFontFamily)
    const showYzforumBackground = ref(0)
    const showYzforumBackgroundBlur = ref(0)
    const showYzforumBackLoli = ref(true)

    function setYzforumFontStyle(font: string) {
        showYzforumFontStyle.value = font
        document.documentElement.style.setProperty('--font-family', font)
    }

    function setYzforumTransparency(trans: number, mode: 'dark' | 'light') {
        showYzforumPageTransparency.value = trans
        if (mode === 'light') {
            document.documentElement.style.setProperty(
                '--yzforum-trans-white-5',
                `rgba(255, 255, 255, ${trans / 100})`
            )
        } else {
            document.documentElement.style.setProperty(
                '--yzforum-trans-white-5',
                `rgba(15, 37, 61, ${trans / 100})`
            )
        }
    }

    function setYzforumBackgroundBlur(blur: number) {
        showYzforumBackgroundBlur.value = blur
        document.documentElement.style.setProperty(
            '--yz-background-blur',
            `${blur}px`
        )
    }

    async function setSystemBackground(index: number) {
        showYzforumBackground.value = index
        await deleteImage(settingsCustomBackgroundImageName)
    }

    async function setCustomBackground(file: File) {
        await saveImage(file, settingsCustomBackgroundImageName)
        showYzforumBackground.value = -1
    }

    async function getCurrentBackground() {
        const backgroundImageBlob = await getImage(settingsCustomBackgroundImageName)
        if (showYzforumBackground.value === 0) {
            return ''
        }
        if (showYzforumBackground.value === -1 && backgroundImageBlob) {
            return URL.createObjectURL(backgroundImageBlob)
        }

        return `/bg/bg${showYzforumBackground}.webp`
    }

    async function setYzforumSettingsRecover() {
        yzforumStoreReset()
        await deleteImage(settingsCustomBackgroundImageName)
        await deleteImage(settingsPublishBannerImageName)
    }

    return {
        showYzforumPageTransparency,
        showYzforumFontStyle,
        showYzforumBackground,
        showYzforumBackgroundBlur,
        showYzforumBackLoli,
        setYzforumFontStyle,
        setYzforumTransparency,
        setYzforumBackgroundBlur,
        setSystemBackground,
        setCustomBackground,
        getCurrentBackground,
        setYzforumSettingsRecover
    }
}, {persist: true})