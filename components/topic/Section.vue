<script lang="ts" setup>
const {t} = useI18n()

const props = defineProps<{
  section: string[]
}>()

const iconMap: Record<string, string> = {
  g: 'lucide:gamepad-2',
  t: 'lucide:drafting-compass',
  o: 'lucide:circle-ellipsis'
}
</script>

<template>
  <span v-for="(sec, index) in props.section" :key="index" :class="sec.toLowerCase()[0]" class="section">
    <Icon :name="iconMap[sec[0]]" class="icon"></Icon>
    <span>{{ t(`edit.topic.section.${sec}`) }}</span>
  </span>
</template>

<style lang="scss" scoped>
.section {
  display: flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 7px;
  margin: 3px 5px 3px 3px;
  font-size: small;
  font-weight: bold;

  .icon {
    font-size: 18px;
    margin-right: 5px;
  }
}

.g {
  color: var(--yzforum-blue-5);
  border: 1.5px solid var(--yzforum-blue-5);
}

.t {
  color: var(--yzforum-green-4);
  border: 1.5px solid var(--yzforum-green-4);
}

.o {
  color: var(--yzforum-pink-4);
  border: 1.5px solid var(--yzforum-pink-4);
}
</style>