<script lang="ts" setup>
interface Items {
  value: string
  i18n?: string
  icon?: string
}

interface Props {
  items: Items[]
  defaultValue: string
  iconSize?: string
}

const {t} = useI18n()

const props = defineProps<Props>()

const emits = defineEmits<{ set: [value: string] }>()
</script>

<template>
  <div class="yuzu-nav">
    <span v-for="(item, index) in props.items" :key="index" :class="defaultValue === item.value ? 'active' : ''"
          @click="emits('set', item.value)">
      <span v-if="item.icon" :style="{'font-size': props.iconSize}">
        <Icon :name="item.icon" class="icon"></Icon>
      </span>
      <span v-if="item.i18n">{{ t(item.i18n) }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.yuzu-nav {
  display: flex;
  align-items: center;
  // 尝试修复出现滚动条的问题
  overflow: hidden;

  & > span {
    cursor: pointer;
    padding: 3px 10px;

    &:hover {
      color: var(--yzforum-blue-5);
    }

    &:first-child {
      padding-left: 0;
    }

    span {
      padding: 0 5px 5px;
    }
  }

  .active {
    span {
      color: var(--yzforum-blue-5);
      border-bottom: 3px solid var(--yzforum-blue-5);
    }
  }
}
</style>