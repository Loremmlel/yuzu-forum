<script lang="ts" setup>
import {backgroundImages} from "~/components/yuzu/setting-panel/backgroundImages";

const {locale, t} = useI18n()

const setting = usePersistSettingsStore()

const imagesPerPage = 9
const totalPages = Math.ceil(backgroundImages.length / imagesPerPage)
const currentPage = ref(1)

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * imagesPerPage
  const end = start + imagesPerPage
  return backgroundImages.slice(start, end)
})

function nextPage() {
  if (currentPage.value < totalPages) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

async function restoreBackground() {
  await setting.setSystemBackground(0)
}

async function handleChangeImage(index: number) {
  await setting.setSystemBackground(index)
}
</script>

<template>
  <div class="background">
    <div class="bg-settings">
      {{ t('header.settings.background') }}
    </div>

    <div class="container">
      <div class="options">
        <div>
          <span class="prev" @click="prevPage">
            <Icon class="icon" name="lucide:chevron-left"></Icon>
          </span>
        </div>
        <div>
          <span class="next" @click="nextPage">
            <Icon class="icon" name="lucide:chevron-right"></Icon>
          </span>
        </div>
        <div>
          <span @click="restoreBackground">{{ t('header.settings.restore') }}</span>
        </div>
        <YuzuSettingPanelCustomBackground></YuzuSettingPanelCustomBackground>
      </div>

      <div>
        <ul class="yzforum-restore-bg">
          <li v-for="image in paginatedImages"
              v-tooltip="{message: image.message[locale as Language], position: 'bottom'}">
            <NuxtImg v-if="image" :src="`bg/${image.index}-m.webp`" loading="lazy"
                     @click="handleChangeImage(image.index)"></NuxtImg>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
  display: block;
  height: 100%;
  font-size: 15px;
  color: var(--yzforum-font-color-3);

  .options {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 5px;

    div > span {
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 10px;
      box-shadow: var(--shadow);
      color: var(--yzforum-font-color-3);
      transition: all 0.3s;
      @include yz-center;

      &:hover {
        background-color: var(--yzforum-trans-blue-0);
        color: var(--yzforum-blue-5)
      }
    }
  }
}

.bg-settings {
  margin: 10px 0;
}

.yzforum-restore-bg {
  padding: 0;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(3, 80px);
  grid-template-rows: repeat(3, 45px);
  grid-gap: 5px;
  position: relative;
  margin: 0 0 10px;

  li {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      cursor: pointer;
      width: 80px;
      position: relative;
      transition: transform 0.3s, z-index 0.3s;
      z-index: 0;

      &:hover {
        transform: scale(1.8);
        z-index: 10;
      }
    }

    .image-detail {
      position: absolute;
    }
  }
}
</style>