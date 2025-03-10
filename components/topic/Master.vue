<script lang="ts" setup>
import type {TopicDetail} from "~/types/api/topic";
import {formatDate} from "~/utils/timeUtils";

const {locale, t} = useI18n()

const props = defineProps<{ topic: TopicDetail }>()

/**
 * 计算主题状态标签
 * @function loliStatus
 * @returns {string} 状态标识字符串
 * @description 根据主题的点赞时间和状态码计算当前显示状态：
 * - 如果点赞时间在最近10小时内显示featured
 * - 根据状态码映射显示状态：正常(0)、封禁(1)、置顶(2)、精华(3)
 */
const loliStatus = computed(() => {
  if (hourDiff(props.topic.upvoteTime, 10)) {
    return 'featured'
  }
  const statusMap: Record<number, string> = {
    0: 'normal',
    1: 'banned',
    2: 'pinned',
    3: 'essential'
  }
  return statusMap[props.topic.status]
})
</script>

<template>
  <div id="k0" class="master">
    <!-- 标题区域 -->
    <div class="header">
      <h1 class="title">
        {{ topic.title }}
      </h1>
    </div>

    <!-- 主体内容容器 -->
    <div class="content">
      <!-- 顶部信息栏（板块标签和时间） -->
      <div class="top">
        <div class="section">
          <TopicSection :section="topic.section"></TopicSection>
          <TopicTags v-if="topic.tags" :show-icon="true" :tags="topic.tags"></TopicTags>
        </div>

        <span class="time">
          {{ formatDate(topic.time, locale, {showYear: true, isPrecise: true}) }}
        </span>
      </div>

      <!-- 中间主要内容区域 -->
      <div class="center">
        <!-- 用户信息卡片（包含移动端时间显示） -->
        <TopicYzgamerInfo v-if="topic.user" :user="topic.user">
          <span class="time-mobile">
            {{ formatDate(topic.time, locale, {showYear: true, isPrecise: true}) }}
          </span>
        </TopicYzgamerInfo>
        <!-- 主题正文内容渲染 -->
        <YuzuContent :content="topic.content"></YuzuContent>
      </div>

      <!-- 底部状态栏 -->
      <div class="bottom">
        <!-- 主题状态标签 -->
        <div class="status">
          <span>{{ `${t('topic.content.status')}:` }}</span>
          <span :class="loliStatus">
            {{ t(`topic.content.${loliStatus}`) }}
          </span>
        </div>

        <span class="line"></span>
        <!-- 浏览数统计（带多语言提示） -->
        <span v-if="topic.views > 0" v-tooltip="{
          message: {
            'en-us': 'Views',
            'ja-jp': '閲覧数',
            'zh-cn': '浏览数'
          },
          position: 'bottom'
        }" class="views">
          <Icon class="icon" name="lucide:mouse-pointer-click"></Icon>
          {{ topic.views }}
        </span>

        <!-- 编辑时间显示（带多语言提示） -->
        <s v-if="topic.edited" v-tooltip="{
            message: {
              'en-us': 'Rewrite Time',
              'ja-jp': 'Rewrite 時間',
              'zh-cn': 'Rewrite 时间'
            },
            position: 'bottom'
        }" class="rewrite">
          ×
          {{ formatDate(topic.edited, locale, {showYear: true, isPrecise: true}) }}
        </s>
      </div>
    </div>
    <TopicFooter :topic="topic"></TopicFooter>
  </div>
</template>

<style lang="scss" scoped>
.master {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-bottom: 20px;

  @include yz-blur;
}

.header {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  @include yz-center;
  color: var(--yzforum-font-color-3);
  font-size: 18px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1px;

  &::before {
    content: '';
    margin: 0;
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.top {
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: space-between;
  flex-grow: 1;
  padding: 0 20px;

  .section {
    display: flex;
    flex-wrap: wrap;
  }

  .time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: var(--yzforum-font-color-1);
    margin-left: 20px;
  }
}

.time-mobile {
  display: none;
  font-size: 14px;
  color: var(--yzforum-font-color-1);
  padding: 0 20px;

  .rewrite-mobile {
    color: var(--yzforum-blue-5);
  }
}

.center {
  width: 100%;
  display: flex;
}

.bottom {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  .status {
    display: flex;
    flex-shrink: 0;
    font-size: 12px;
    margin: 0 10px;
    color: var(--yzforum-font-color-3);

    span {
      &:nth-child(1) {
        margin-right: 5px;
      }

      &:nth-child(2) {
        padding: 1px 4px;
        color: var(--yzforum-white);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: var(--yzforum-trans-blue-2);
  }

  .views {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin: 0 10px;

    span {
      display: flex;
      margin-right: 3px;
    }

    &:nth-child(1) span {
      color: var(--yzforum-red-4);
    }
  }

  .rewrite {
    white-space: nowrap;
    font-size: small;
    color: var(--yzforum-blue-5);
    margin-right: 10px;
  }
}

.normal {
  background-color: var(--yzforum-green-4);
}

.banned {
  background-color: var(--yzforum-gray-4);
}

.pinned {
  background-color: var(--yzforum-red-4);
}

.essential {
  background-color: var(--yzforum-yellow-2);
}

.featured {
  background-color: var(--yzforum-pink-4);
}

.active {
  box-shadow: 0 0 0 2px var(--yzforum-red-4) inset;
  border-radius: 10px;
  background-color: var(--yzforum-trans-blue-0);
}

@media (max-width: 1000px) {
  .top {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 700px) {
  .master {
    margin-bottom: 10px;
  }

  .top {
    .time {
      display: none;
    }
  }

  .time-mobile {
    display: block;
  }

  .center {
    flex-direction: column;
  }

  .status {
    span {
      &:nth-child(1) {
        display: none;
      }
    }
  }
}
</style>