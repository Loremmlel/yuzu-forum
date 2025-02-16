<script lang="ts" setup>
import type {HomeGameResources} from "~/types/api/home";
import {useTempGameResourceStore} from "~/store/temp/game/resource";
import {platformIconMap, typeIconMap} from "~/components/game/utils/iconMap";

const {locale, t} = useI18n()
const props = defineProps<{ link: HomeGameResources }>()

const user = usePersistUserStore()
const gameResource = useTempGameResourceStore()
</script>

<template>
  <div class="title">
    <NuxtLinkLocale :to="`/game/${props.link.gid}`">
      {{ getPreferredLanguageText(props.link.name, locale as Language) }}
    </NuxtLinkLocale>
    <span class="time">
      {{ formatTimeDiff(props.link.time, locale as Language) }}
    </span>
  </div>

  <div class="link">
    <div class="base">
      <div class="info">
        <span v-if="props.link.grid === gameResource.rewriteResourceId" class="rewrite">
          <Icon class="icon" name="svg-spinners:12-dots-scale-rotate"></Icon>
          <span>{{ t('game.resource.edit') }}</span>
        </span>
        <span>
          <Icon :name="typeIconMap[props.link.type]" class="icon"></Icon>
          <span>{{ t(`game.resource.type.${props.link.type}`) }}</span>
        </span>
        <span>
          <Icon class="icon" name="lucide:database"></Icon>
          <span>{{ props.link.size }}</span>
        </span>
        <span>
          <Icon :name="platformIconMap[props.link.platform]" class="icon"></Icon>
          <span>{{ t(`game.resource.platform.${props.link.platform}`) }}</span>
        </span>
        <span>
          {{ t(`game.resource.language.${props.link.language}`) }}
        </span>
      </div>

      <div class="status">
        <GameResourceLike v-if="user.uid !== props.link.uid" v-tooltip="{
          message: {
              'en-us': 'Like',
              'ja-jp': 'いいね',
              'zh-cn': '点赞'
            },
            position: 'bottom'
        }"
                          :gid="props.link.gid" :grid="props.link.grid" :likes="props.link.likes"
                          :to-uid="props.link.uid"></GameResourceLike>
        <NuxtLinkLocale v-if="user.uid === props.link.uid" v-tooltip="{
          message: {
              'en-us': 'Report violation',
              'ja-jp': '違反の報告',
              'zh-cn': '举报违规'
            },
            position: 'bottom'
        }" aria-label="Report violation"
                        to="/report">
          <Icon class="icon" name="lucide:triangle-alert"></Icon>
        </NuxtLinkLocale>

        <span v-tooltip="{
          message: {
              'en-us': link.status ? 'Link expired' : 'Link valid',
              'ja-jp': link.status
                ? 'リンクが期限切れです'
                : 'リンクは有効です',
              'zh-cn': link.status ? '链接过期' : '链接有效'
            },
            position: 'bottom'
        }" :class="`status-${props.link.status}`" class="status-dot">
        </span>
      </div>
    </div>
    <YuzuDivider color="var(--yzforum-trans-blue-1)" margin="0 0 20px 0"></YuzuDivider>
  </div>
</template>

<style lang="scss" scoped>
.title {
  width: 100%;
  font-size: 18px;
  margin-bottom: 10px;

  a {
    color: var(--yzforum-blue-5);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .time {
    color: var(--yzforum-font-color-0);
    font-size: small;
    font-weight: initial;
    margin-left: 20px;
    white-space: nowrap;
  }
}

.base {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: var(--yzforum-trans-blue-0);
  border-radius: 10px;
  margin-bottom: 10px;

  & > span {
    padding: 4px 8px;
    margin-right: 10px;
    display: flex;
    align-items: center;
  }

  .icon {
    font-size: medium;
    margin-right: 5px;
  }
}

.status {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-left: auto;

  & > span,
  a {
    color: var(--yzforum-font-color-3);
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}

.status-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.status-0 {
  width: 10px;
  height: 10px;
  background-color: var(--yzforum-green-4);
  border-radius: 50%;
}

.status-1 {
  width: 10px;
  height: 10px;
  background-color: var(--yzforum-red-4);
  border-radius: 50%;
}
</style>