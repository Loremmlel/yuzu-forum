<script setup lang="ts">
const {t} = useI18n()
</script>

<template>
  <!--导航栏-->
  <div class="top-bar">
    <YuzuPopover>
      <span class="nav">{{ t('header.topic.name') }}</span>
      <template #content>
        <div class="menu">
          <NuxtLinkLocale class="item" to="/pool">
            <span>{{ t('header.topic.all') }}</span>
          </NuxtLinkLocale>
          <NuxtLinkLocale class="item" to="/category">
            <span>
              <span>{{ t('header.topic.category') }}</span>
            </span>
          </NuxtLinkLocale>
        </div>
      </template>
    </YuzuPopover>

    <YuzuPopover>
      <span class="nav">{{ t('header.publish.name') }}</span>
      <template #content>
        <div class="menu">
          <NuxtLinkLocale class="item" to="/edit/topic">
            <span>{{ t('header.publish.topic') }}</span>
          </NuxtLinkLocale>
          <NuxtLinkLocale class="item" to="/edit/game?type=publish">
            <span>
              <span>{{ t('header.publish.game') }}</span>
            </span>
          </NuxtLinkLocale>
        </div>
      </template>
    </YuzuPopover>

    <YuzuPopover>
      <span class="nav">{{ t('header.about.name') }}</span>
      <template #content>
        <div class="menu">
          <NuxtLinkLocale class="item" to="/yzforum">
            <span>
              {{ t('header.about.about') }}
            </span>
          </NuxtLinkLocale>

          <NuxtLinkLocale class="item" to="/contact">
            <span>
              <span>{{ t('header.about.contact') }}</span>
            </span>
          </NuxtLinkLocale>
        </div>
      </template>
    </YuzuPopover>

    <NuxtLinkLocale class="link" to="/game">
      <span>
        {{ t('header.game') }}
      </span>
    </NuxtLinkLocale>

    <NuxtLinkLocale class="link" to="/">
      <span>
        {{ t('header.home') }}
      </span>
    </NuxtLinkLocale>
  </div>
</template>

<style scoped lang="scss">
@mixin underline-hover {
  position: relative;
  color: var(--yzforum-blue-5);

  &::before {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--yzforum-blue-2);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }
}

.top-bar {
  text-align: center;
  align-items: center;
  display: flex;
  margin-left: 30px;

  .nav {
    cursor: pointer;
    display: block;
    line-height: 60px;
    width: 100%;
    padding: 0 18px;
    white-space: nowrap;
  }

  .menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
    padding: 10px;

    @include yz-blur;

    .item {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      position: relative;
      color: var(--yzforum-blue-5);
      padding: 10px;

      span {
        @include underline-hover;
      }

      &:hover span::before {
        transform: scaleX(1);
      }
    }
  }
}

.link {
  display: block;
  line-height: 58px;
  width: 100%;
  padding: 0 17px;
  position: relative;
  color: var(--yzforum-blue-5);

  span {
    white-space: nowrap;
    @include underline-hover;
  }

  &:hover span::before {
    transform: scaleX(1);
  }
}

@media (max-width: 1000px) {
  .top-bar {
    display: none;
  }
}
</style>