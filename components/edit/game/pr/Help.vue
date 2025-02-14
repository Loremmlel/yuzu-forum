<script setup lang="ts">
const {locale, t} = useI18n()
</script>

<template>
  <YuzuHeader :size="1">
    <template #header>
      {{ t('edit.pr.name') }}
    </template>
  </YuzuHeader>
  <div class="help" v-if="locale === 'en-us'">
    <p>
      To update game information, you need to submit an update request.
    </p>
    <p>
      When this request is confirmed for merge by the publisher of the
      game resource, a user with more than 1100 Points, or a forum
      administrator, the update will take effect.
    </p>
    <p>
      If the update request is merged, you will receive 1 Point. The
      requester and reviewer will be added to the contributors, but
      self-modifications are not counted.
    </p>
  </div>

  <div class="help" v-if="locale === 'ja-jp'">
    <p>gameの情報を更新するには、更新リクエストを提出する必要があります。</p>
    <p>
      このリクエストがgameリソースの投稿者、ポイントが1100を超えるユーザー、
      またはフォーラム管理者によって確認・統合された場合のみ、更新が反映されます。
    </p>
    <p>
      リクエストの更新が統合されると、1ポイントが獲得できます。リクエスト提出者と
      審査者は貢献者に追加されますが、自分で修正した場合は対象外となります。
    </p>
  </div>

  <div class="help" v-if="locale === 'zh-cn'">
    <p>要更新游戏信息, 需要提出更新请求</p>
    <p>
      当该请求被该游戏资源的发布者、或柚子点大于 1100
      的用户、或论坛管理员确认合并后, 该更新才会生效
    </p>
    <p>
      若请求更新被合并, 将获得 1 柚子点, 请求提出者和审核者会被加入贡献者中,
      自己修改不计
    </p>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 20px;

  @include yz-blur;
}

.help {
  border-left: 5px solid var(--yzforum-blue-5);
  padding-left: 20px;
  margin-bottom: 20px;
  font-size: small;

  p {
    margin-bottom: 10px;
  }
}
</style>