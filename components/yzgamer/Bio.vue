<script lang="ts" setup>
import type {UserInfo} from "~/types/api/user";
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const props = defineProps<{ user: UserInfo }>()

const refresh = inject<() => Promise<void>>('refresh')
const bioValue = ref('')

async function handleChangeBio() {
  if (!bioValue.value.trim()) {
    return
  }

  if (bioValue.value.length > 107) {
    useMessage(InfoCode.SignatureLengthExceeded, 'warn')
    return
  }

  const result = await $fetch('/api/user/bio', {
    method: 'PUT',
    watch: false,
    body: {bio: bioValue.value},
    ...yzforumResponseHandler
  })

  if (result) {
    useMessage(InfoCode.SignatureUpdateSuccess, 'success')
    bioValue.value = ''
    await refresh?.()
  }
}

onMounted(() => {
  bioValue.value = props.user.bio
})
</script>

<template>
  <div class="bio">
    <div class="title">{{ t('user.settings.bio') }}</div>
    <YuzuTextarea v-model="bioValue" :placeholder="`${t('user.settings.hint')}`" name="bio" rows="5"></YuzuTextarea>

    <YuzuButton @click="handleChangeBio">
      {{ t('user.settings.confirm') }}
    </YuzuButton>
  </div>
</template>

<style lang="scss" scoped>
.bio {
  width: 100%;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 10px;
}
</style>