<script lang="ts" setup>
import type {CategoryResponseData} from "~/types/api/category";

const {t, locale} = useI18n()
const localePath = useLocalePath()

defineProps<{ sections: CategoryResponseData[] }>()

function formatNumberWithCommas(number: number): string {
  if (number >= 10000) {
    return (number / 1000).toFixed(1) + 'k'
  } else {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

</script>

<template>
  <section v-for="(section, index) in sections" :key="index" class="section">
    <div class="section-title">
      <span>{{ t(`edit.topic.section.${section.section}`) }}</span>
    </div>

    <!--fix: 把打错字的tp改成to-->
    <NuxtLink :to="`/section/${section.section}`" class="content">
      <div class="topic">
        <span @click.prevent="navigateTo(localePath(`topic/${section.topic.tid}`))">
          {{ section.topic.title }}
        </span>
        <p>
          {{ t('category.publish') }}
          {{ formatTimeDiff(section.topic.time, locale) }}
        </p>
      </div>

      <div class="statistic">
        <div class="count">
          <span>Topics</span>
          <span>{{ formatNumberWithCommas(section.topics) }}</span>
        </div>
        <div class="views">
          <span>Views</span>
          <span>{{ formatNumberWithCommas(section.views) }}</span>
        </div>
      </div>
    </NuxtLink>
  </section>
</template>

<style lang="scss" scoped>
.section {
  margin-bottom: 20px;

  .section-title {
    transition: transform 0.2s ease;

    span {
      margin-right: 10px;
    }
  }

  &:hover {
    .section-title {
      transform: translateX(20px) translateY(10px);
    }

    .content {
      &::before {
        width: 100%;
        z-index: -1;
        transition: width 0.2s;
        background-color: var(--yzforum-trans-blue-1);
      }
    }
  }
}

.section-title {
  padding: 5px;
  border-bottom: none;
  filter: drop-shadow(2px 4px 3px var(--yzforum-trans-blue-4));

  span {
    padding: 2px 30px;
    text-align: center;
    background-color: var(--yzforum-trans-white-2);
    clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%);
  }
}

.content {
  padding: 10px 0 10px 20px;
  display: flex;
  justify-content: space-between;
  position: relative;
  color: var(--yzforum-font-color-3);

  .topic {
    span {
      color: var(--yzforum-blue-5);

      &:hover {
        text-decoration: underline;
      }
    }

    p {
      font-size: small;
      margin-top: 10px;
      color: var(--yzforum-font-color-0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 5px;
    height: 100%;
    background-color: var(--yzforum-blue-5);
  }
}

.statistic {
  display: flex;
  user-select: none;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 10px;

    span {
      &:first-child {
        color: var(--yzforum-font-color-0);
        font-size: small;
      }
    }
  }
}
</style>