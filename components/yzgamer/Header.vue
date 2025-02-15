<script setup lang="ts">
interface Props {
  uid?: number
  name?: string
  avatar?: string
  point?: number
}

const {t} = useI18n()

const props = defineProps<Props>()

const userStore = usePersistUserStore()
const showProgress = ref(false)
const pWidth = computed(() => props.point ? `${props.point % 100}%` : '0%')

onMounted(() => showProgress.value = true)
</script>

<template>
  <div class="header">
    <div class="avatar" v-if="avatar">
      <NuxtImg :src="avatar" :alt="name"></NuxtImg>
    </div>

    <div class="username">
      <NuxtLink v-if="userStore.uid !== uid" :to="`/message/user/${uid}`">
        <Icon class="icon" name="lucide:message-circle"></Icon>
        <span>{{ t('user.chat') }}</span>
      </NuxtLink>
      <span>{{ name }}</span>
    </div>

    <div class="point">
      <Transition name="progress">
        <div v-if="showProgress" class="p-progress"></div>
      </Transition>
      <p>
        <Icon class="icon" name="lucide:lollipop"></Icon>
        <span>{{ point }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  height: 150px;
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 100%;
}

.avatar {
  position: absolute;
  top: 5px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  left: 50px;
  z-index: 2;
  @include yz-center;
  overflow: hidden;

  img {
    width: 100%;
  }

  &:hover {
    animation: spin 1s;
  }
}

.username {
  flex-grow: 2;
  width: 100%;
  background-color: var(--yzforum-trans-blue-0);
  border-radius: 10px 10px 0 0;
  display: flex;
  padding-left: 233px;
  font-size: 24px;
  flex-direction: column;
  justify-content: end;

  a {
    display: flex;
    align-items: center;
    color: var(--yzforum-blue-5);
    font-size: 16px;

    .icon {
      margin-right: 4px;
    }
  }
}

@keyframes spin {
  50% {
    transform: rotate(360deg);
  }
  70% {
    transform: scale(1.1);
  }
  80% {
    box-shadow: 0 0 2px 8px var(--yzforum-trans-blue-2);
  }
}

.point {
  flex-grow: 1;
  display: flex;
  align-items: center;
  z-index: 1;

  p {
    position: absolute;
    right: 0;
    font-size: 18px;
    padding-right: 20px;
    font-style: italic;
    @include yz-center;

    span {
      @include yz-center;
      color: var(--yzforum-pink-4);

      &:nth-child(1) {
        font-size: 20px;
      }
    }
  }
}

.p-progress {
  transition: width 0.5s;
  height: 100%;
  width: v-bind(pWidth);
  background-color: var(--yzforum-trans-pink-1);
}

.progress-enter-active {
  width: 0;
}


@media (max-width: 700px) {
  .header {
    height: 110px;
  }

  .avatar {
    left: 30px;
    width: 100px;
    height: 100px;
  }

  .username {
    padding-left: 150px;
  }
}
</style>