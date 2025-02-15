<script setup lang="ts">
import {InfoCode} from "~/code&message/infoCode";

const {t} = useI18n()

const refresh = inject<() => Promise<void>>('refresh')
const uploadedImage = ref<Blob>()
const selectedFileUrl = ref<string>()
const input = ref<HTMLElement>()
const isUploading = ref(false)
const userStore = usePersistUserStore()

async function uploadImage(file: File) {
  const isFileValid = checkImageValid(file)
  if (!isFileValid) {
    return
  }
  const resizedFile = await resizeImage(file, 233, 233)
  uploadedImage.value = resizedFile
  selectedFileUrl.value = URL.createObjectURL(resizedFile)
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) {
    return
  }
  uploadImage(input.files[0])
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  const dataTransfer = event.dataTransfer
  if (dataTransfer && dataTransfer.files[0]) {
    uploadImage(dataTransfer.files[0])
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'copy'
}

async function handleChangeAvatar() {
  if (!uploadedImage.value) {
    useMessage(InfoCode.InvalidAvatar, 'warn')
    return
  }
  const formData = new FormData()
  formData.append('avatar', uploadedImage.value, userStore.name)
  isUploading.value = true
  useMessage(InfoCode.AvatarUploading, 'info')
  const avatarLink = await $fetch('/api/user/avatar', {
    method: 'POST',
    body: formData,
    watch: false,
    ...yzforumResponseHandler
  })
  if (!avatarLink) {
    return
  }
  userStore.avatar = avatarLink
  userStore.avatarMin = avatarLink.replace(/\.webp$/, '-100.webp')
  selectedFileUrl.value = ''
  useMessage(InfoCode.AvatarUpdateSuccess, 'success')
  await refresh?.()
}

function checkImageValid(file: File) {
  if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
    return true
  } else {
    useMessage(InfoCode.InvalidFileType, 'warn')
    return false
  }
}
</script>

<template>
  <div class="avatar">
    <div class="title">{{ t('user.settings.avatar') }}</div>

    <div class="container">
      <div ref="upload" tabindex="0" class="avatar-upload" @drop="handleDrop($event)"
          @dragover="handleDragOver" @click="input?.click()">
        <span class="plus" v-if="!selectedFileUrl"></span>
        <NuxtImg class="avatar-preview" :src="selectedFileUrl"
            alt="Uploaded Image" v-if="selectedFileUrl"></NuxtImg>
        <input ref="input" hidden type="file" accept="*.jpg *.jpeg *.png *.webp"
               @change="handleFileChange($event)">
      </div>

      <div class="help">
        <div class="hint">
          <span>{{ t('user.settings.drag') }}</span>
          <span>{{ t('user.settings.click') }}</span>
        </div>
        <YuzuButton :pending="isUploading" @click="handleChangeAvatar">
          {{ t('user.settings.confirm') }}
        </YuzuButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  width: 100%;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 10px;
}

.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.avatar-upload {
  width: 150px;
  height: 150px;
  border: 1px solid var(--yzforum-blue-5);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    border: 1px solid var(--yzforum-pink-3);

    .plus::before,
    .plus::after {
      background: var(--yzforum-pink-3);
    }
  }

  .plus {
    display: inline-block;
    position: relative;
  }

  .plus::before,
  .plus::after {
    transition: all 0.2s;
    content: '';
    position: absolute;
    background: var(--yzforum-blue-5);
  }

  .plus::before {
    width: 20px;
    height: 2px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .plus::after {
    width: 2px;
    height: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.avatar-preview {
  max-width: 140px;
  max-height: 140px;
}

.help {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: small;
}

.hint {
  @include yz-center;
  flex-direction: column;
}

@media (max-width: 700px) {
  .help {
    padding: 0 10px;
  }
  .hint {
    display: none;
  }
}
</style>