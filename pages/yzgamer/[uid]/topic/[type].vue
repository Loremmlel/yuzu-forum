<script lang="ts" setup>
import type {TopicType, UserInfo} from "~/types/api/user";

const props = defineProps<{ user: UserInfo }>()
const route = useRoute()
const topicType = ref(route.params.type as TopicType)

const count = computed(() => {
  switch (topicType.value) {
    case 'publish':
      return props.user.topic
    case 'like':
      return props.user.likeTopic
    case 'upvote':
      return props.user.upvoteTopic
    case 'favorite':
      return props.user.favoriteTopic
    default:
      return 0
  }
})
</script>

<template>
  <YzgamerList>
    <YzgamerTopic :type="topicType" :uid="user.uid"></YzgamerTopic>

    <YuzuNull :condition="count === 0" type="null"></YuzuNull>
  </YzgamerList>
</template>

<style lang="scss" scoped>

</style>