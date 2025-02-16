<script lang="ts" setup>
import {InfoCode} from "~/code&message/infoCode";
import {resizeImage} from "~/utils/imageUtils";

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
  <div :style="{width: props.width, 'aspect-ratio': props.aspect}" class="yuzu-upload" tabindex="0"
       @click="handleClickUpload" @dragover="handleDragOver($event)" @drop="handleDrop($event)">
    <span v-if="!selectedFileUrl && !initialImage" class="plus"></span>
    <span v-if="props.hint" class="hint">{{ props.hint }}</span>
    <NuxtImg v-if="selectedFileUrl || initialImage" :src="selectedFileUrl || initialImage"
             :style="{'max-width': `calc(${props.width} - 10px)`}" alt="Uploaded Image"
             class="preview"></NuxtImg>
    <input ref="input" accept="*.jpg *.jpeg *.png *.webp" hidden type="file" @change="handleFileChange($event)"></input>
  </div>
</template>

<style lang="scss" scoped>
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