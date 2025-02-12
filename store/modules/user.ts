import type {LoginResponseData} from "~/types/api/user";

export const usePersistUserStore = defineStore('YzforumUser', () => {
    const uid = ref(0)
    const name = ref('')
    const avatar = ref('')
    const avatarMin = ref('')
    const point = ref(0)
    const accessToken = ref('')
    const roles = ref(0)

    function setUserInfo(user: LoginResponseData) {
        uid.value = user.uid
        name.value = user.name
        avatar.value = user.avatar
        avatarMin.value = user.avatar.replace(/\.webp$/, '-100.webp')
        point.value = user.point
        roles.value = user.roles
        accessToken.value = user.token
    }

    function setToken(token: string) {
        accessToken.value = token
    }

    function removeToken() {
        accessToken.value = ''
    }

    function reset() {
        uid.value = 0
        name.value = ''
        avatar.value = ''
        avatarMin.value = ''
        point.value = 0
        roles.value = 0
        accessToken.value = ''
    }

    return {
        uid,
        name,
        avatar,
        avatarMin,
        point,
        accessToken,
        roles,
        setUserInfo,
        setToken,
        removeToken,
        reset
    }
}, {persist: true})