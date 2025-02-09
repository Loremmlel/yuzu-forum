import Cookies from "js-cookie";

type Message = string | YuzuLanguage

interface TooltipBinding {
    message: Message,
    position: 'top' | 'right' | 'bottom' | 'left'
}

function initializeTooltip(element: HTMLElement, binding: DirectiveBinding) {
    const {message, position} = (binding.value as TooltipBinding) || {
        message: '',
        position: 'left'
    }
    element.setAttribute('position', position)
    if (typeof message === 'string') {
        element.setAttribute('tooltip', message)
        return
    }

    const localeCookies = Cookies.get('yzforum-language')
    const defaultLocale = window?.location.href.match(/\/[a-z]{2}-[a-z]{2}\//)?.[1] ?? 'zh-cn'
    const locale = localeCookies ?? defaultLocale
    element.setAttribute('tooltip', message[locale as Language])
}

export default defineNuxtPlugin((nuxt) => {
    nuxt.vueApp.directive('tooltip', {
        mounted(element: HTMLElement, binding: DirectiveBinding) {
            initializeTooltip(element, binding)
        },
        updated(element: HTMLElement, binding: DirectiveBinding) {
            initializeTooltip(element, binding)
        }
    })
})