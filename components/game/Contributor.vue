<script setup lang="ts">
interface Props {
  data: YuzuUser[]
  pending: boolean
  views: number
}

defineProps<Props>()

const {t} = useI18n()
</script>

<template>
  <YuzuHeader :size="2">
    <template #header>
      {{ t('game.contributors') }}
    </template>
  </YuzuHeader>

  <div class="contributor" v-if="data && !pending">
    <YuzuAvatar size="30px" v-for="(user, index) in data" :key="index" :user="user" v-tooltip="{
        message: user.name,
        position: 'bottom'
      }"></YuzuAvatar>
    <span v-if="views > 0" class="views" v-tooltip="{
        message: {
          'en-us': 'Views',
          'ja-jp': '閲覧数',
          'zh-cn': '浏览数'
        },
        position: 'bottom'}">
      <Icon class="icon" name="lucide:mouse-pointer-click"></Icon>
      <span>{{ views }}</span>
    </span>
  </div>
  <YuzuSkeletonGameContributor v-if="pending"></YuzuSkeletonGameContributor>
</template>

<style scoped lang="scss">
h2 {
  margin-bottom: 20px;
}

.contributor {
  display: flex;
  margin-bottom: 20px;
}

.views {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  user-select: none;

  span {
    display: flex;
    margin-right: 3px;
  }

  &:nth-child(1) span {
    color: var(--yzforum-red-4);
  }
}
</style>