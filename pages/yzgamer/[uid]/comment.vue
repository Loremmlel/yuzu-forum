<script lang="ts" setup>
import type {UserInfo} from "~/types/api/user";

defineProps<{ user: UserInfo }>()
</script>

<template>
  <YzgamerList>
    <YzgamerComment :uid="user.uid"></YzgamerComment>

    <YuzuNull :condition="!user.comment" type="null"></YuzuNull>
  </YzgamerList>
</template>

<style lang="scss" scoped>

</style>