import {$command} from "@milkdown/utils";
import {linkSchema} from "@milkdown/preset-commonmark";

/**
 * 定义一个名为insertLinkPlugin的插件。这个插件使用$command函数创建一个叫做'InsertLink'的新命令。
 */
export const insertLinkPlugin = $command('InsertLink', (ctx) =>
    /**
     * 返回一个函数，该函数接收payload作为参数。
     * @param payload 包含要插入链接的信息，即链接地址和显示文本。
     */
    (payload: { href: string; text: string } | undefined) =>
        /**
         * 这个内部函数进一步接受state（当前文档状态）和dispatch（更新文档状态的方法）作为参数。
         * @param state
         * @param dispatch
         */
        (state, dispatch?) => {
            if (!dispatch || !payload) {
                return false
            }

            // 创建一个新的事务(transaction)，事务是ProseMirror中用于修改文档状态的主要机制。
            const transaction = state.tr
            // 使用linkSchema.type(ctx).create方法根据给定的链接地址创建一个新的链接标记(mark)。
            // 标记在ProseMirror中用于为文本添加属性，比如这里是将一段文本标记为链接。
            const linkMark = linkSchema.type(ctx).create({href: payload.href})

            // 通过一系列链式调用修改transaction：
            // 1. addStoredMark(linkMark)：设置当前活动的存储标记为刚才创建的链接标记。
            // 2. insertText(payload.text)：在当前位置插入指定的文本内容，并自动应用上一步设置好的链接标记。
            // 3. removeStoredMark(linkMark)：移除存储标记，防止后续输入继续被标记为链接。
            // 4. scrollIntoView()：滚动视图以使新插入的内容可见。
            dispatch(transaction
                .addStoredMark(linkMark)
                .insertText(payload.text)
                .removeStoredMark(linkMark)
                .scrollIntoView())
            return true
        }
)
