<script setup lang="ts">
import DefaultLayout from '~/layouts/default.vue'

const route = useRoute()
const getRouteBaseName = useRouteBaseName()
const baseRouteName = computed(() => getRouteBaseName(route))

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 700
})

const showAside = computed(() => !isMobile.value || baseRouteName.value === 'message')

const showContent = computed(() => !isMobile.value || (isMobile.value && baseRouteName.value !== 'message'))
</script>

<template>
  <DefaultLayout>
    <div class="content-container">
      <MessageAsideContainer v-show="showAside" class="aside"></MessageAsideContainer>

      <div v-if="showContent" class="content">
        <slot></slot>
        <YuzuFooter></YuzuFooter>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped lang="scss">
.content-container {
  border-radius: 10px;
  height: calc(100dvh - 75px);
  transition: width 0.2s;
  max-width: 80rem;
  margin: auto;
  display: flex;
}

.content {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
  margin-left: 16px;

  @include yz-blur;
}

.yuzu-footer {
  margin: 16px 0;
}

@media (max-width: 700px) {
  .aside {
    width: 100%;
    max-width: unset;
    margin: 0 5px;
  }

  .content {
    margin-left: 0;
    width: 100%;
  }
}
</style>