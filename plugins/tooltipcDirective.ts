import Cookies from "js-cookie";

type Message = string | YuzuLanguage

interface TooltipBinding {
    message: Message,
    position: 'top' | 'right' | 'bottom' | 'left'
}

function initializeTooltip(el: HTMLElement, binding: DirectiveBinding) {
    const {message, position} = (binding.value as TooltipBinding) || {
        message: '',
        position: 'left'
    }
    el.setAttribute('position', position)
    if (typeof message === 'string') {
        el.setAttribute('tooltip', message)
        return
    }

    const localeCookies = Cookies.get('yzforum-language')
    const defaultLocale = window?.location.href.match(/\/[a-z]{2}-[a-z]{2}\//)?.[1] ?? 'zh-cn'
    const locale = localeCookies ?? defaultLocale
    el.setAttribute('tooltip', message[locale as Language])
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('tooltip', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
            initializeTooltip(el, binding)
        },
        updated(el: HTMLElement, binding: DirectiveBinding) {
            initializeTooltip(el, binding)
        }
    })
})