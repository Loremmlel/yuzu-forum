<script setup lang="ts">
import 'animate.css'

interface Props {
  message: YuzuLanguage
  type: 'warn' | 'success' | 'error' | 'info'
  richText?: boolean
}

const props = withDefaults(defineProps<Props>(), {richText: false})

const locale = useCookie('yzforum-language').value
const getDefaultLocale = () => window?.location.href.match(/\/([a-z]{2}-[a-z]{2})\//)?.[1] ?? 'zh-cn'

const messageRef = computed(() => {
  const currentLocale = locale || getDefaultLocale()
  return props.message[currentLocale as keyof YuzuLanguage] || props.message['zh-cn']
})

const messageClassMap = {
  warn: 'animate__animated animate__headShake',
  success: 'animate__animated animate_bounceInDown',
  error: 'animate__animated animate__tada',
  info: 'animate__animated animate__bounce'
}

const messageClass = computed(() => `${messageClassMap[props.type]} ${props.type}`)

</script>

<template>
  <div class="yzforum-message-container">
    <div class="yzforum-message" :class="messageClass">
      <Icon class="icon" :name="`lucide:${{
        warn: 'triangle-alert',
        success: 'check',
        error: 'x',
        info: 'info'
      }[props.type]}`"></Icon>
      <span v-if="!props.richText" class="message">{{ messageRef }}</span>
      <span v-else v-html="messageRef"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.yzforum-message-container {
  position: fixed;
  top: 100px;
  margin: 0 auto;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  z-index: 9999;
}

.yzforum-message {
  margin: 0 auto;
  font-size: large;
  padding: 1vh 10vw;

  @include yz-blur;
  @include yz-center;

  span {
    @include yz-center;
    flex-direction: column;
  }

  .message {
    word-break: break-all;
  }
}

.icon {
  font-size: 24px;
  margin-right: 18px;
}

.warn {
  border: 1px solid var(--yzforum-yellow-3);

  .icon {
    color: var(--yzforum-yellow-3);
  }
}

.success {
  border: 1px solid var(--yzforum-green-4);

  .icon {
    color: var(--yzforum-green-4);
  }
}

.error {
  border: 1px solid var(--yzforum-red-4);

  .icon {
    color: var(--yzforum-red-4);
  }
}

.info {
  border: 1px solid var(--yzforum-blue-5);

  .icon {
    color: var(--yzforum-blue-5);
  }
}
</style>