<script lang="ts" setup>
import 'animate.css'

const {showYzforumPanel} = storeToRefs(useTempSettingStore())
</script>

<template>
  <div class="header">
    <YuzuTopBarNav></YuzuTopBarNav>
    <YuzuTopBarAvatar></YuzuTopBarAvatar>
  </div>
  <div class="settings-panel">
    <Transition
        enter-active-class="animate__animated animate__jackInTheBox animate__faster"
        leave-active-class="animate__animated animate__fadeOutRight animate__faster">
      <KeepAlive>
        <LazyYuzuSettingPanel v-if="showYzforumPanel"
                              @close="showYzforumPanel = false"></LazyYuzuSettingPanel>
      </KeepAlive>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.header {
  height: 60px;
  box-shadow: 0 2px 4px var(--yzforum-trans-blue-0);
  background-color: var(--yzforum-trans-white-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
  flex-shrink: 0;
  color: var(--yzforum-font-color-3);
  padding: 0 50px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    backdrop-filter: blur(var(--yz-background-blur));
    will-change: transform;
  }
}

.settings-panel {
  z-index: 989;
}

@media (max-width: 700px) {
  .header {
    margin-bottom: 5px;
    padding: 0 15px;
  }
}
</style>