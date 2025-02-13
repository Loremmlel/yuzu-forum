import {decodeIfEncoded} from "~/server/utils/decodeIfEncoded";

export const useYuzuCopy = (originText: string) => {
    const text = decodeIfEncoded(originText)
    navigator.clipboard
        .writeText(text)
        .then(() => {
            useMessage({
                    'en-us': `${text} copied successfully!`,
                    'ja-jp': `${text} のコピーに成功しました！`,
                    'zh-cn': `${text} 复制成功`
                },
                'success'
            )
        })
        .catch(() => {
            useMessage(
                {
                    'en-us': `${text} copy failed! Please switch to a more modern browser!`,
                    'ja-jp': `${text} のコピーに失敗しました！よりモダンなブラウザに切り替えてください！`,
                    'zh-cn': `${text} 复制失败! 请更换更现代的浏览器!`
                },
                'error'
            )
        })
}