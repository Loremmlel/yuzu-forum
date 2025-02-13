<script setup lang="ts">
import {dataURItoBlob} from "~/utils/dataURItoBlob";
import {InfoCode} from "~/code&message/infoCode";

const props = defineProps<{
  width: string
  size: number
  aspect: number
  initialImage?: string
  hint?: string
}>()
const emits = defineEmits<{
  setImage: [img: Blob]
}>()

const input = ref<HTMLElement>()
const uploadedImage = ref<Blob>()
const selectedFileUrl = ref<string>('')
const initialImage = computed(() => props.initialImage ? props.initialImage : '')

/**
 * 图像上传处理流程
 *
 * 实现功能：
 * 文件类型校验（JPEG/PNG/WEBP）
 * 图像尺寸调整（保持宽高比，不超过设定尺寸）
 * 格式转换与压缩（转换为WEBP，质量80%）
 * 文件大小二次校验（压缩后仍超过1MB则拒绝）
 * @param {File} file - 用户选择的原始图像文件
 */
async function uploadImage(file: File) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  function checkImageValid(file: File) {
    if (allowedTypes.includes(file.type)) {
      return true
    } else {
      useMessage(InfoCode.InvalidFileType, 'warn')
      return false
    }
  }

  function resizeImage(file: File, width: number, height: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = URL.createObjectURL(file)
      image.onload = () => {
        let newWidth = image.width
        let newHeight = image.height

        // 仅在原始尺寸超过限制时进行调整
        if (image.width > width || image.height > height) {
          const aspectRatio = image.width / image.height
          // 根据宽高比决定缩放基准
          if (aspectRatio > 1) {
            newWidth = width
            newHeight = newWidth / aspectRatio
          } else {
            newHeight = height
            newWidth = newHeight * aspectRatio
          }
        }

        // 使用canvas进行实际缩放操作
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = newWidth
        canvas.height = newHeight

        ctx?.drawImage(image, 0, 0, newWidth, newHeight)
        const resizedFile = dataURItoBlob(canvas.toDataURL('image/webp', 0.8))

        if (resizedFile.size > 1024 * 1024) {
          useMessage(InfoCode.FileSizeExceeded, 'warn')
          reject(new Error('Image is too large.'))
        } else {
          resolve(resizedFile)
        }
      }
    })
  }

  const isFileValid = checkImageValid(file)
  if (!isFileValid) {
    return
  }

  const resizedFile = await resizeImage(file, props.size, props.size / props.aspect)
  uploadedImage.value = resizedFile
  selectedFileUrl.value = URL.createObjectURL(resizedFile)

  emits('setImage', resizedFile)
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) {
    return
  }
  const file = input.files[0]
  uploadImage(file)
}

/**
 * 处理文件拖放事件
 *
 * 阻止默认行为（浏览器默认会打开文件）
 * 提取拖放文件列表的第一个文件
 * @param event 拖放事件对象
 */
function handleDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()

  const dataTransfer = event.dataTransfer
  if (dataTransfer && dataTransfer.files.length > 0) {
    const file = dataTransfer.files[0]
    uploadImage(file)
  }
}

/**
 * 处理拖放悬停事件
 *
 * 实现逻辑：设置拖放效果为复制操作，显示可视化反馈
 * @param event 拖放悬停事件
 */
function handleDragOver(event: DragEvent) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'copy'
}

function handleClickUpload() {
  input.value?.click()
}
</script>

<template>
  <div tabindex="0" class="yuzu-upload" :style="{width: props.width, 'aspect-ratio': props.aspect}"
       @drop="handleDrop($event)" @dragover="handleDragOver($event)" @click="handleClickUpload">
    <span class="plus" v-if="!selectedFileUrl && !initialImage"></span>
    <span class="hint" v-if="props.hint">{{ props.hint }}</span>
    <NuxtImg :style="{'max-width': `calc(${props.width} - 10px)`}" class="preview"
             v-if="selectedFileUrl || initialImage" :src="selectedFileUrl || initialImage"
             alt="Uploaded Image"></NuxtImg>
    <input ref="input" hidden type="file" accept="*.jpg *.jpeg *.png *.webp" @change="handleFileChange($event)"></input>
  </div>
</template>

<style scoped lang="scss">
.yuzu-upload {
  border: 1px solid var(--yzforum-blue-5);
  border-radius: 10px;
  @include yz-center;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    border: 1px solid var(--yzforum-pink-3);

    .plus::before, .plus::after {
      background: var(--yzforum-pink-3);
    }
  }

  .hint {
    width: 200px;
    position: absolute;
    color: var(--yzforum-font-color-0);
    font-size: small;
    font-style: oblique;
    text-align: center;
  }

  .plus {
    display: inline-block;
    position: relative;
  }

  .plus::before, .plus::after {
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

.preview {
  max-width: 140px;
  max-height: 140px;
}
</style>