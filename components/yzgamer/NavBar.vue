<script lang="ts" setup>
import type {Nav} from "~/components/yzgamer/utils/route";
import 'animate.css'

const {t} = useI18n()
const localePath = useLocalePath()

const props = defineProps<{ uid: number, nav: Nav[] }>()

const userStore = usePersistUserStore()
const route = useRoute()
const fullPath = computed(() => route.fullPath.replace(/^\/[a-z]{2}-[a-z]{2}\//, '/'))

const iconMap: Record<string, string> = {
  profile: 'lucide:user-round',
  settings: 'lucide:settings',
  email: 'lucide:mail',
  password: 'lucide:key-round',
  topic: 'lucide:square-gantt-chart',
  game: 'lucide:gamepad-2',
  reply: 'lucide:reply',
  comment: 'uil:comment-dots'
}

const currentPageUserRoles = computed(() => {
  if (!userStore.uid) {
    return 1
  }
  if (userStore.uid === props.uid) {
    return 4
  }
  return userStore.roles
})

function activeClass(route: Nav) {
  return fullPath.value === `/yzgamer/${props.uid}/${route.router}` ? 'active' : ''
}

function handleCollapsed(item: Nav) {
  // false也算，所以必须写!== undefined
  if (item.collapsed !== undefined) {
    item.collapsed = !item.collapsed
  } else {
    navigateTo(localePath(`/yzgamer/${props.uid}/${item.router}`))
  }
}
</script>

<template>
  <div class="nav">
    <div v-for="(n, index) in nav" v-show="n.permission?.includes(currentPageUserRoles)" :key="index">
      <div :class="activeClass(n)" class="link" @click="handleCollapsed(n)">
        <span class="nav-icon">
          <Icon :name="iconMap[n.name] ?? ''" class="icon"></Icon>
        </span>
        <span class="name">{{ t(`user.nav.${n.name}`) }}</span>
        <span v-if="n.collapsed !== undefined" :class="n.collapsed ? '' : 'active-chevron'" class="chevron">
          <Icon class="icon" name="lucide:chevron-right"></Icon>
        </span>
      </div>

      <div v-if="n.child && !n.collapsed" class="submenu">
        <YzgamerNavBar :nav="n.child" :uid="uid"></YzgamerNavBar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  height: 100%;
  width: 130px;
  flex-shrink: 0;
  overflow: scroll;
  scrollbar-width: none;
}

.link {
  padding: 10px;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--yzforum-blue-5);
  border-radius: 10px;

  &:hover {
    background-color: var(--yzforum-trans-blue-1);
  }

  & > span {
    display: flex;
    margin-left: 10px;

    &:first-child {
      font-size: 20px;
    }

    &:nth-child(2) {
      font-size: small;
    }

    &:last-child {
      transition: all 0.2s;
    }
  }

  .active-chevron {
    transform: rotate(90deg);
  }
}

.submenu {
  background-color: var(--yzforum-trans-blue-0);
}

.active {
  color: var(--yzforum-white);
  background-color: var(--yzforum-blue-5);

  &:hover {
    background-color: var(--yzforum-blue-5);
  }
}

@media (max-width: 700px) {
  .nav {
    width: 80px;
    font-size: small;
  }

  .link {
    padding: 10px 8px;

    .name {
      display: none;
    }
  }

  .submenu {
    border-radius: 10px;

    .link {
      padding: 10px 0;

      .nav-icon {
        display: none;
      }

      .name {
        display: block;
      }
    }
  }
}
</style>