import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypePrism from 'rehype-prism-plus'
import {unified} from 'unified'

export async function markdownToHtml(markdown: string) {
    const htmlVFile = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(remarkFrontmatter)
        .use(remarkGfm)
        .use(rehypePrism, {ignoreMissing: true})
        .use(rehypeStringify)
        .process(markdown)

    let htmlContent = htmlVFile.toString()
    const videoLinkRegex = /kv:<a href="https?:\/\/\S+?\.(mp4)">[^<]+<\/a>/g
    htmlContent = htmlContent.replace(videoLinkRegex, (_, videoUrl) => {
        return `<video controls loop playsinline width="100%" src="${videoUrl}"></video>`
    })
    return htmlContent
}