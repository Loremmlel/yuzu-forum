<script setup lang="ts">
import type {GamePR, GamePRDetails} from "~/types/api/gamePR";

const iconMap: Record<number, string> = {
  0: 'lucide:loader',
  1: 'lucide:check',
  2: 'lucide:x'
}

const {locale, t} = useI18n()

interface Props {
  gid: number
  pr: GamePR
  status: UseFetchStatus
  refresh: () => void
}

const props = defineProps<Props>()

const userStore = usePersistUserStore()
const details = ref<Partial<GamePRDetails>>()
const isFetching = ref(false)

async function handleGetDetails(gprid: number) {
  if (details.value) {
    return
  }
  isFetching.value = true
  const result = await $fetch(`/api/game/${props.gid}/pr`, {
    method: 'GET',
    query: {gprid},
    watch: false,
    ...yzforumResponseHandler
  })
  isFetching.value = false

  if (result) {
    details.value = result as GamePRDetails
  }
}

watch(
    () => props.status,
    () => {
      if (props.status === 'pending') {
        details.value = undefined
      }
    }
)
</script>

<template>
  <div class="pr">
    <div class="info">
      <YuzuAvatar :user="pr.user" size="30px"></YuzuAvatar>
      <NuxtLink :to="`/yzgamer/${pr.user.uid}/info`">
        {{ pr.user.name }}
      </NuxtLink>
      <span>{{ t('game.pr.request') }}</span>
      <span class="time">{{ formatTimeDiff(pr.time, locale) }}</span>
    </div>

    <div class="button">
      <span class="description" :class="`status${pr.status}`">
        <span v-if="pr.completedTime">
          {{
            formatDate(pr.completedTime, locale, {
              showYear: true,
              isPrecise: true
            })
          }}
        </span>
        <Icon class="icon" :name="iconMap[pr.status]"></Icon>
        <span>{{ t(`game.pr.status${pr.status}`) }}</span>
      </span>

      <YuzuButton v-if="!details && pr.status !== 2" @click="handleGetDetails(pr.gprid)"
                  :pending="isFetching">
        {{ t('game.pr.details') }}
      </YuzuButton>

      <span v-if="pr.status === 2">#{{ pr.index }}</span>
      <span v-if="details" class="close" @click="details = undefined">
        <Icon name="lucide:x" class="icon"></Icon>
      </span>
    </div>
  </div>

  <p class="note" v-if="userStore.uid === props.pr.user.uid && props.pr.status === 0">
    {{t('game.pr.note')}}
  </p>
  <GamePRDetails v-if="details" :details="details" :refresh="refresh"></GamePRDetails>
</template>

<style scoped lang="scss">
.pr {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 14px;

  a {
    margin: 0 10px;
    color: var(--yzforum-blue-5);
  }

  .time {
    color: var(--yzforum-font-color-1);
    margin-left: 10px;
  }
}

.button {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .description {
    @include yz-center;
    padding: 3px 10px;
    font-size: 14px;

    span {
      &:nth-child(1) {
        margin-right: 5px;
      }
    }

    .icon {
      margin-right: 5px;
    }
  }

  .yuzu-button {
    padding: 3px 10px;
  }

  .close {
    cursor: pointer;
    font-size: 20px;
  }
}

.note {
  margin-bottom: 20px;
  font-weight: bold;
  color: var(--yzforum-red-5);
}

.status0 {
  color: var(--yzforum-blue-5);
}

.status1 {
  color: var(--yzforum-green-4);
}

.status2 {
  color: var(--yzforum-red-5);
}
</style>