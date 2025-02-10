<script lang="ts" setup>
const {locale, t} = useI18n()
const config = useRuntimeConfig()
useHead({
  title: t('head.name'),
  htmlAttrs: {
    lang: locale.value
  },
  meta: [
    {
      name: 'description',
      content: t('seo.game.description')
    },
    {
      name: 'keywords',
      content: t('head.keywords')
    },
    {
      name: 'format-detection',
      content: 'telephone=no'
    },
    {
      property: 'og:title',
      content: t('head.name')
    },
    {
      property: 'og:description',
      content: t('head.description')
    },
    {
      property: 'og:image',
      content: '/yzforum.webp'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: config.public.YZFORUM_URL
    },
    {
      name: 'theme-color',
      content: '#218bff'
    }
  ],
  link: [
    {
      rel: "icon",
      href: '/favicon.ico'
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png'
    }
  ]
})
</script>
<template>
  <div class="root">

  </div>
</template>
<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100dvh - 75px);
  max-width: 80rem;
  margin: 0 auto;
  padding: 17px;

  @include yz-blur;
}

@media (max-width: 1000px) {
  .root {
    min-height: calc(100dvh - 65px);
    padding: 17px 10px;
  }
}
</style>