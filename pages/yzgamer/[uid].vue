<script lang="ts" setup>
import type {UserInfo} from "~/types/api/user";
import {navBarRoute} from "~/components/yzgamer/utils/route";

const {t} = useI18n()

const route = useRoute()
const uid = ref(route.params.uid as string)

const userStore = usePersistUserStore()

const user = ref<UserInfo>()
const isBanned = ref(false)

const {data, refresh} = await useFetch(`/api/user/${uid.value}`, {
  method: 'GET',
  ...yzforumResponseHandler
})

if (data.value === 'banned') {
  isBanned.value = true
} else {
  user.value = data.value as UserInfo ?? undefined
}

provide('refresh', refresh)

onMounted(() => {
  if (!user.value || userStore.uid !== user.value.uid) {
    return
  }
  if (user.value.avatar) {
    userStore.avatar = user.value.avatar
    userStore.avatarMin = userStore.avatar.replace(/\.webp$/, '-100.webp')
  }
  userStore.point = user.value.point
})

useHead({
  title: `${user.value?.name} - 柚子游戏`,
  meta: [
    {
      name: 'description',
      content: user.value?.bio ? user.value?.bio : user.value?.name
    }
  ]
})
</script>

<template>
  <div class="root">
    <div class="container">
      <YzgamerHeader v-if="user" :uid="user.uid" :name="user.name" :avatar="user.avatar"
                     :point="user.point"></YzgamerHeader>
      <div class="content">
        <YzgamerNavBar :uid="parseInt(uid)" :nav="navBarRoute"></YzgamerNavBar>
        <NuxtPage :user="user"></NuxtPage>
      </div>
    </div>
    <YuzuNull :condition="!user && !isBanned" type="404"></YuzuNull>
    <YuzuBlank v-if="isBanned">
      {{t('user.banned')}}
    </YuzuBlank>
    <YuzuFooter></YuzuFooter>
  </div>
</template>

<style lang="scss" scoped>
.root {
  margin: 0 auto;
  min-height: 800px;
  max-width: 80rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  width: 100%;
  margin: auto;

  @include yz-blur;
}

.content {
  min-height: 700px;
  display: flex;
}

.yz-footer {
  margin: 16px 0;
}

@media (max-width: 700px) {
  .root {
    padding: 0 5px;
  }
}
</style>