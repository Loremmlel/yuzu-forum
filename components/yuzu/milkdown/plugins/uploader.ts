import type {Uploader} from "@milkdown/plugin-upload";
import type {Node} from "@milkdown/prose/model"
import {Decoration} from '@milkdown/prose/view'

/**
 * 定义一个异步上传器函数，用于处理文件并上传图像到服务器
 * @param files 用户选择的文件数组，期望包含图像文件
 * @param schema 编辑器的模式，用于创建图像节点
 * @returns 返回一个包含上传成功后创建的图像节点数组
 */
export const yuzuUploader: Uploader = async (files, schema) => {
    const images: File[] = []

    for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (!file) {
            continue
        }
        if (!file.type.startsWith('image/')) {
            continue
        }
        images.push(file)
    }

    // 并发上传所有图像文件，并创建图像节点
    const nodes: Node[] = await Promise.all(images.map(async (image) => {
        // 创建表单数据对象，用于上传图像文件
        const formData = new FormData()
        formData.append('image', image)
        const result = await $fetch('/api/image/topic', {
            method: 'POST',
            body: formData,
            watch: false,
            ...yzforumResponseHandler
        })
        // 使用图像文件名作为替代文本
        const alt = image.name
        // 根据上传结果创建并填充图像节点
        return schema.nodes.image.createAndFill({
            src: result,
            alt
        }) as Node
    }))
    return nodes
}

/**
 * 创建一个上传小部件工厂函数，用于生成上传中的装饰器小部件
 * @param pos 装饰器的位置
 * @param spec 装饰器的其他配置参数
 * @returns 返回一个装饰器小部件
 */
export const yuzuUploadWidgetFactory = (
    pos: number,
    spec: Parameters<typeof Decoration.widget>[2]
) => {
    const {$i18n} = useNuxtApp()

    const widgetDOM = document.createElement('span')
    // 设置DOM元素的文本内容为上传中的提示信息
    widgetDOM.textContent = $i18n.t('edit.topic.uploading')
    widgetDOM.style.color = 'var(--yzforum-blue-5)'

    return Decoration.widget(pos, widgetDOM, spec)
}
