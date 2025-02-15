<script lang="ts" setup>
import type {UserInfo} from "~/types/api/user";

definePageMeta({
  middleware: 'auth'
})

defineProps<{user: UserInfo}>()
</script>

<template>
  <div class="settings">
    <YzgamerAvatar></YzgamerAvatar>
    <YzgamerBio :user="user"></YzgamerBio>
    <YzgamerUsername></YzgamerUsername>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
}
</style>