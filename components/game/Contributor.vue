<script lang="ts" setup>
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

  <div v-if="data && !pending" class="contributor">
    <YuzuAvatar v-for="(user, index) in data" :key="index" v-tooltip="{
        message: user.name,
        position: 'bottom'
      }" :user="user" size="30px"></YuzuAvatar>
    <span v-if="views > 0" v-tooltip="{
        message: {
          'en-us': 'Views',
          'ja-jp': '閲覧数',
          'zh-cn': '浏览数'
        },
        position: 'bottom'}" class="views">
      <Icon class="icon" name="lucide:mouse-pointer-click"></Icon>
      <span>{{ views }}</span>
    </span>
  </div>
  <YuzuSkeletonGameContributor v-if="pending"></YuzuSkeletonGameContributor>
</template>

<style lang="scss" scoped>
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