<script lang="ts" setup>
// 游戏、技术、其它话题
const iconMap: Record<string, string> = {
  g: 'lucide:gamepad-2',
  t: 'lucide:drafting-compass',
  o: 'lucide:circle-ellipsis'
}

const props = defineProps<{ section: string[] }>()
</script>

<template>
  <span v-for="(sec, index) in props.section" :key="index" :class="sec.toLowerCase()[0]" class="section">
    <Icon :name="iconMap[sec[0]]" class="icon"></Icon>
  </span>
</template>

<style lang="scss" scoped>
.section {
  display: flex;
  align-items: center;
  margin-right: 5px;

  .icon {
    font-size: 16px;
  }

  span {
    margin-left: 5px;
  }
}

.g {
  color: var(--yzforum-blue-5);
}

.t {
  color: var(--yzforum-green-4);
}

.o {
  color: var(--yzforum-pink-4);
}
</style>