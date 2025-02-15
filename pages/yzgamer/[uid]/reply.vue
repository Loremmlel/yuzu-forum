<script lang="ts" setup>
import type {UserInfo} from "~/types/api/user";

defineProps<{ user: UserInfo }>()
</script>

<template>
  <YzgamerList>
    <YzgamerReply :uid="user.uid"></YzgamerReply>

    <YuzuNull :condition="!user.reply" type="null"></YuzuNull>
  </YzgamerList>
</template>

<style lang="scss" scoped>

</style>