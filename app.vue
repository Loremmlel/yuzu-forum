<script lang="ts" setup>
import {usePersistSettingsStore} from "~/store/modules/settings";

const {locale, t} = useI18n()
const colorMode = useColorMode()
const persistSettings = usePersistSettingsStore()

useHead({
  htmlAttrs: {
    lang: locale.value
  },
  link: [
    {
      rel: 'alternate',
      href: `https://www.yuzugame.moe/rss/topic.xml?locale=${locale.value}`,
      type: 'application/rss+xml',
      title: t('head.topicRSS')
    },
    {
      rel: 'feed',
      href: `https://www.yuzugame.moe/rss/topic.xml?locale=${locale.value}`,
      type: 'application/rss+xml',
      title: t('head.topicRSS')
    },
    {
      rel: 'feed',
      href: `https://www.yuzugame.moe/rss/game.xml?locale=${locale.value}`,
      type: 'application/rss+xml',
      title: t('head.gameRSS')
    },
    {
      rel: 'alternate',
      href: `https://www.yuzugame.moe/rss/game.xml?locale=${locale.value}`,
      type: 'application/rss+xml',
      title: t('head.gameRSS')
    },
    {
      rel: 'me',
      href: 'https://tieba.baidu.com/home/main?id=tb.1.9f660194.afXf_VzuT1aphkZOIPs77A',
      type: 'text/html',
      title: 'Baidu Tieba Youzi'
    }
  ],
  title: t('head.name')
})

useSchemaOrg([
    defineOrganization({
      name: t('head.name'),
      url: 'https://www.yuzugame.moe',
      sameAs: ['https://tieba.baidu.com/home/main?id=tb.1.9f660194.afXf_VzuT1aphkZOIPs77A']
    }),
    defineWebSite({name: t('head.name')}),
    defineWebPage()
])

onMounted(() => {
  persistSettings.setYzforumTransparency(
      persistSettings.showYzforumPageTransparency,
      colorMode.value as 'dark' | 'light'
  )
  persistSettings.setYzforumBackgroundBlur(persistSettings.showYzforumBackgroundBlur)
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
