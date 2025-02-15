<script lang="ts" setup>
import type {UserInfo} from "~/types/api/user";

const {locale, t} = useI18n()

const props = defineProps<{user: UserInfo}>()

function rolesName() {
  const roles = props.user.roles
  switch (roles) {
    case 1:
      return 'user'
    case 2:
      return 'admin'
    case 3:
      return 'SU'
    default:
      return ''
  }
}

function statusName() {
  const status = props.user.status
  switch (status) {
    case 0:
      return 'normal'
    case 1:
      return 'banned'
    default:
      return ''
  }
}
</script>

<template>
  <div class="article" v-if="user">
    <div class="info">
      <div class="basic">
        <span>{{ t('user.profile.name') }}: {{ user.name }}</span>
        <span>{{ t('user.profile.point') }}: {{ user.point }}</span>
        <span>{{ t('user.profile.register') }}: {{ user.uid }}</span>
        <span>
          {{ t('user.profile.roles') }}:
          {{ t(`user.profile.${rolesName()}`) }}
        </span>
        <span>
          {{ t('user.profile.status') }}:
          {{ t(`user.profile.${statusName()}`) }}
        </span>
        <span>{{ t('user.profile.upvote') }}: {{ user.upvote }}</span>
        <span>{{ t('user.profile.like') }}: {{ user.like }}</span>
        <span>{{ t('user.profile.dislike') }}: {{ user.dislike }}</span>
        <span>{{ t('user.profile.today') }}: {{ user.dailyTopicCount }}</span>
        <span>{{ t('user.profile.topic') }}: {{ user.topic }}</span>
        <span>{{ t('user.profile.reply') }}: {{ user.reply }}</span>
        <span> {{ t('user.profile.comment') }}: {{ user.comment }} </span>
        <span>{{ t('user.profile.game.game') }}: {{ user.game }}</span>
        <span>
          {{ t('user.profile.game.contribute') }}:
          {{ user.contributeGame }}
        </span>
        <span>
          {{ t('user.profile.game.daily') }}:
          {{ user.dailyGameCount }}
        </span>
        <span>
          {{ t('user.profile.time') }}:
          {{formatDate(user.time, locale, {showYear: true, isPrecise: true}) }}
        </span>
      </div>

      <YuzuDivider margin="0 10px"></YuzuDivider>

      <div class="bio">
        <div>{{t('user.profile.bio')}}</div>
        <pre v-if="user.bio">{{user.bio}}</pre>

        <YuzuNull :condition="!user.bio" type="null" :show-sticker="false"></YuzuNull>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article {
  flex-grow: 1;
  padding: 10px 0;
}

.info {
  display: flex;
  flex-direction: column;
}

.basic {
  font-size: small;
  place-items: center;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 2fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
  padding-bottom: 10px;

  span {
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 10px;
    cursor: default;

    &:hover {
      background-color: var(--yzforum-trans-blue-0);
    }

    &:last-child {
      grid-column-start: span 3;
    }
  }
}

.bio {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  div {
    &:nth-child(1) {
      margin-bottom: 10px;
    }
  }

  pre {
    display: block;
    width: 100%;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    overflow-wrap: break-word;
    font-size: large;
  }
}

.null {
  color: var(--yzforum-blue-2);
  font-style: oblique;
}

@media (max-width: 700px) {
  .bio {
    pre {
      font-size: medium;
    }
  }
}
</style>