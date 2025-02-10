import type {DirectiveBinding} from 'vue'

interface HTMLElementWithCleanup extends HTMLElement {
    _cleanup?: () => void
}

interface GradientBinding {
    color: string
    radius: number
}

function initializeGradient(
    el: HTMLElementWithCleanup,
    binding: DirectiveBinding
) {
    const {color, radius} = (binding.value as GradientBinding) || {
        color: '--yzforum-trans-blue-1',
        radius: 70
    }
    const gradientStyle = {background: ''}

    function onMouseMove(event: MouseEvent) {
        const rect = el.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const xPercent = (x / rect.width) * 100
        const yPercent = (y / rect.height) * 100
        gradientStyle.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%,var(${color}), transparent ${radius}%)`
        el.style.background = gradientStyle.background
    }

    function onMouseLeave() {
        el.style.background = ''
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    el._cleanup = () => {
        el.removeEventListener('mousemove', onMouseMove)
        el.removeEventListener('mouseleave', onMouseLeave)
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('yuzu-gradient', {
        mounted(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
            initializeGradient(el, binding)
        },
        updated(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
            initializeGradient(el, binding)
        },
        beforeMount(el: HTMLElementWithCleanup) {
            if (el._cleanup) {
                el._cleanup()
            }
        }
    })
})
