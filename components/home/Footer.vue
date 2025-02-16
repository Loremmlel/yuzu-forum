<script lang="ts" setup>
const {locale, t} = useI18n()
</script>

<template>
  <footer>
    <div class="subsites">
      <a href="https://tieba.baidu.com/f?kw=%E8%94%A1%E5%B9%B4%E5%BD%AC" rel="noopener noreferer" target="_blank">
        <Icon class="icon" name="arcticons:baidu-tieba"></Icon>
        {{ t('home.subsites.cnbBa') }}
      </a>
    </div>

    <div class="copyright">
      <div>
        <a :href="`${useRuntimeConfig().public.YZFORUM_URL}/${locale ? locale : ''}`"
           rel="noopener noreferer" target="_blank">
          <NuxtImg :alt="t('head.title')" :aria-label="t('head.title')" src="/favicon.webp"></NuxtImg>
        </a>
        <span>{{ t('home.copyright') }}</span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  margin-top: auto;
  color: var(--yzforum-font-color-2);

  a {
    color: var(--yzforum-blue-5);
    text-decoration: underline;
    text-underline-offset: 3px;
    margin: 0 8px;
  }

  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .subsites {
    display: flex;
    justify-content: center;
    font-size: small;
    margin-bottom: 8px;
    margin-top: 50px;

    a {
      display: flex;
      align-items: center;
    }
  }

  .copyright {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: small;

    div {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }

    img {
      height: 30px;
      width: 30px;
      margin-right: 5px;
    }
  }
}
</style>