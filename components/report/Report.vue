<script setup lang="ts">
import {reportSection, type ReportType} from "~/pages/report/constant";
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()
const reason = ref('')
const selectReportType = ref<ReportType>('topic')
const userStore = usePersistUserStore()
const isFetching = ref(false)

async function handleSubmitReport() {
  if (!userStore.accessToken) {
    useMessage(InfoCode.LoginToReport, 'warn')
    return
  }
  if (!reason.value.trim()) {
    useMessage(InfoCode.ReportReasonEmpty, 'warn')
    return
  }
  if (reason.value.trim().length > 1007) {
    useMessage(InfoCode.ReportContentLimit, 'warn')
    return
  }
  isFetching.value = true
  const result = await $fetch('/api/report/submit', {
    method: 'POST',
    body: {
      type: selectReportType.value,
      reason: reason.value
    },
    watch: false,
    ...yzforumResponseHandler
  })
  isFetching.value = false
  if (result) {
    useMessage(InfoCode.ReportSubmitSuccess, 'success')
    reason.value = ''
  }
}
</script>

<template>
  <div class="container">
    <div class="select-container">
      <span class="title">{{ t('report.select.title') }}</span>
      <YuzuSelect :styles="{width: '100px'}" :options="reportSection as unknown as string[]" default-value="topic"
                  i18n="report.select.section" @set="value => selectReportType = value as ReportType" position="bottom">
        <span>{{t(`report.select.section.${selectReportType}`)}}</span>
      </YuzuSelect>
    </div>
    <div>
      <span class="title">{{t('report.reason.title')}}</span>
      <YuzuTextarea name="comment" :placeholder="t('report.reason.placeholder')"
                    rows="10" v-model="reason"></YuzuTextarea>
      <div class="note">{{t('report.note')}}</div>
    </div>
    <YuzuButton @click="handleSubmitReport" :pending="isFetching">
      {{t('report.submit')}}
    </YuzuButton>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 20px 20px 60px;

  @include yz-blur;
}

.select-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  font-weight: bold;

  &::before {
    content: none;
  }
}

.yuzu-textarea {
  margin-top: 16px;
}

.note {
  color: var(--yzforum-font-color-0);
  font-size: small;
  margin-bottom: 20px;
}
</style>