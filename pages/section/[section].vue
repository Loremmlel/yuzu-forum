<script setup lang="ts">
const categoryMap: Record<string, string> = {
  g: 'game',
  t: 'technique',
  o: 'other'
}

const {t} = useI18n()

const route = useRoute()

const section = computed(() => route.params.section as string)

useHead({
  title: `${t('seo.category.title')} - 柚子游戏`,
  meta: [
    {
      name: 'description',
      content: t(`seo.category.${section.value.toLocaleLowerCase()}`)
    }
  ]
})
</script>

<template>
  <div class="root">
    <div class="title" :class="section[0]">
      <span>{{ t(`edit.topic.${categoryMap[section[0]]}`) }}</span>
      >
      <span>{{ t(`edit.topic.section.${section}`) }}</span>
    </div>
    <Section :section="section"></Section>
  </div>
</template>

<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100dvh - 75px);
  max-width: 80rem;
  margin: 0 auto;

  @include yz-blur;
}

.title {
  padding: 20px;
  font-size: 30px;
  color: var(--yzforum-font-color-0);
  user-select: none;

  span {
    color: var(--yzforum-font-color-3);

    &:last-child {
      font-size: 22px;
    }
  }
}

@media (max-width: 700px) {
  .root {
    min-height: calc(100dvh - 65px);
    margin: 0 5px;
  }

  .title {
    font-size: 22px;

    span {
      &:last-child {
        font-size: 16px;
      }
    }
  }
}
</style>