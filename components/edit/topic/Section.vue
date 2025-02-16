<script lang="ts" setup>
import {gameSection, otherSection, techniqueSection, topicCategory} from "~/components/edit/utils/category";

const {t} = useI18n()

const sectionMap: Record<string, string[]> = {
  game: gameSection,
  technique: techniqueSection,
  other: otherSection
}

const tempEdit = useTempEditStore()
const persistEdit = usePersistEditTopicStore()

const showSection = computed(() => persistEdit.category.length || tempEdit.category.length)

function showSelect(name: string) {
  return tempEdit.category.includes(name) || persistEdit.category.includes(name)
}

function handleSetSection(name: string, value: string) {
  if (tempEdit.isTopicRewriting) {
    const section = intersection(tempEdit.section, sectionMap[name])
    if (!section.length) {
      tempEdit.section.push(value)
    } else if (!tempEdit.section.includes(value)) {
      tempEdit.section = tempEdit.section.filter(item => item !== section[0])
      tempEdit.section.push(value)
    }
  } else {
    const section = intersection(persistEdit.section, sectionMap[name])
    if (!section.length) {
      persistEdit.section.push(value)
    } else if (!persistEdit.section.includes(value)) {
      persistEdit.section = persistEdit.section.filter(item => item !== section[0])
      persistEdit.section.push(value)
    }
  }
}

function intersection<T>(array1: T[], array2: T[]): T[] {
  const set1 = new Set(array1)
  const set2 = new Set(array2)
  const result: T[] = []

  set1.forEach((item) => {
    if (set2.has(item)) {
      result.push(item)
    }
  })

  return result
}
</script>

<template>
  <div v-if="showSection" class="section">
    <div v-for="(select, index) in topicCategory" v-show="showSelect(select.name)" :key="index">
      <YuzuSelect v-if="showSelect(select.name)" :options="select.options" :styles="{width: '150px'}"
                  i18n="edit.topic.section" position="top"
                  @set="(value) => handleSetSection(select.name, value)">
        <span>{{ t(`edit.topic.${select.name}`) }}</span>
      </YuzuSelect>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>