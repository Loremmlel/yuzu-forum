import {useTempGamePRStore} from "~/store/temp/edit/game";

export default defineNuxtRouteMiddleware((_, __) => {
    const type = useRequestURL().searchParams.get('type')
    const { gamePR } = useTempGamePRStore()

    if (type === 'pr' && !gamePR[0]) {
        return navigateTo('/game', { replace: true })
    }
})