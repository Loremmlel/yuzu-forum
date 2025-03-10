<script setup lang="ts">
import type {SearchResultUser} from "~/types/api/search";

defineProps<{
  user: SearchResultUser
}>()

const { locale } = useI18n()
</script>

<template>
  <NuxtLink :to="`/yzgamer/${user.uid}/info`" v-yuzu-gradient>
    <div class="info">
      <YuzuAvatar :user="user" size="30px"></YuzuAvatar>
      <span>{{ user.name }}</span>
    </div>
    <div class="bio" v-if="user.bio">
      <pre>{{ user.bio }}</pre>
    </div>
    <div class="addition">
      <span class="point">
        <span><Icon class="icon" name="lucide:lollipop"></Icon></span>
        <span>{{ user.point }}</span>
      </span>
      <span>{{ formatDate(user.time, locale, { showYear: true }) }}</span>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
a {
  display: flex;
  flex-direction: column;
  color: var(--yzforum-font-color-3);
  padding: 10px;
  border-radius: 10px;
}

.info {
  display: flex;
  align-items: center;

  span {
    margin-left: 10px;
  }
}

.bio {
  margin-top: 10px;

  pre {
    display: block;
    width: 100%;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    overflow-wrap: break-word;
  }
}

.addition {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: small;

  .point {
    display: flex;
    align-items: center;
    margin-left: 5px;
    font-weight: bold;
    color: var(--yzforum-pink-4);

    .icon {
      font-size: 20px;
      margin-right: 5px;
    }
  }
}
</style>