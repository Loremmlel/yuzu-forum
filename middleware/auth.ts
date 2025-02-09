import {usePersistUserStore} from "~/store/modules/user";
import {InfoCode} from "~/code&message/infoCode";

export default defineNuxtRouteMiddleware(() => {
    const user = usePersistUserStore()
    const nuxt = useNuxtApp()

    if (!user.accessToken) {
        useMessage(InfoCode.LoginRequiredAction, 'warn', 5000)
        return navigateTo(nuxt.$localePath('/login'))
    }
})