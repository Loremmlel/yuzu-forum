<script lang="ts" setup>
import loliImage from './loli'
import 'animate.css'

const {t} = useI18n()
const message = useComponentMessageStore()

const {loli, name} = loliImage
const timer = ref<NodeJS.Timeout | null>()
const progressWidth = ref('')

function handleClose() {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  message.showInfo = false
}

watch(
    () => message.showInfo,
    (newValue) => {
      if (newValue) {
        const startTime = Date.now()
        timer.value = setInterval(() => {
          const currentTime = Date.now()
          const elapsedTime = currentTime - startTime
          const elapsedPercentage = (elapsedTime / message.durations) * 100
          const remainingPercentage = Math.max(1, 100 - elapsedPercentage)
          progressWidth.value = remainingPercentage + '%'
          if (remainingPercentage <= 1 && timer.value) {
            clearInterval(timer.value)
            timer.value = null
            message.showInfo = false
          }
        }, 10)
      } else if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
      }
    }
)
</script>

<template>
  <Teleport :disabled="!message.showInfo" to="body">
    <Transition
        enter-active-class="animate__animated animate__fadeInUp animate__faster"
        leave-active-class="animate__animated animate__fadeOutDown animate__faster">
      <div v-if="message.showInfo" class="container">
        <Transition appear enter-active-class="animate__animated animate_swing">
          <div class="lass">
            <span>{{ name }}</span>
          </div>
        </Transition>

        <div class="avatar">
          <NuxtImg :src="loli"></NuxtImg>
        </div>

        <Transition appear enter-active-class="animate__animated animate__bounceInRight animate__faster">
          <div class="info">
            {{ `「 ${t(message.infoMessage)} 」` }}
          </div>
        </Transition>

        <div class="close" @click="handleClose">
          <Icon class="icon" name="lucide:x"></Icon>
        </div>

        <span class="progress"></span>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.container {
  min-height: 120px;
  width: 100%;
  border-top: 1px solid var(--yzforum-blue-2);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  @include yz-blur;
}

.lass {
  font-size: 20px;
  position: absolute;
  top: -41px;
  padding: 5px 5px 5px 150px;
  border-bottom: none;
  filter: drop-shadow(2px 4px 3px var(--yzforum-trans-blue-4));

  span {
    padding: 0 50px;
    text-align: center;
    background-color: var(--yzforum-trans-white-2);
    font-size: 24px;
    clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%);
  }
}

.avatar {
  position: absolute;
  margin-top: 10px;
  margin-left: 20px;
  pointer-events: none;
  user-select: none;

  img {
    height: 100px;
    width: 100%;
  }
}

.info {
  margin-top: 20px;
  margin-left: 150px;
  margin-right: 50px;
  font-size: 20px;
  color: var(--yzforum-white);
  text-shadow: 0 1px var(--yzforum-font-color-3),
  1px 0 var(--yzforum-font-color-3),
  -1px 0 var(--yzforum-font-color-3),
  0 -1px var(--yzforum-font-color-3),
  1px 2px var(--yzforum-font-color-3),
  1px 2px var(--yzforum-font-color-3),
  1px 2px var(--yzforum-font-color-3),
  1px 2px var(--yzforum-font-color-3);
}

.close {
  font-size: 30px;
  position: absolute;
  top: 0;
  right: 0;
  color: var(--yzforum-font-color-1)
}

.progress {
  position: absolute;
  height: 5px;
  width: v-bind(progressWidth);
  background-color: var(--yzforum-blue-5);
  top: 0;
  right: 0;
}

@media (max-width: 700px) {
  .container {
    min-height: 80px;
  }

  .lass {
    font-size: 15px;
    padding: 5px 5px 5px 20px;
    top: -30px;

    span {
      font-size: 16px;
    }
  }
  .info {
    margin-top: 10px;
    margin-right: 30px;
    margin-left: 80px;
  }

  .avatar {
    img {
      height: 50px;
      width: 100%;
    }
  }
}
</style>