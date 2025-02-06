import {CategoryResponseData} from "~/types/api/category";
import {TopicModel} from "~/server/models/topic";
import {yuzuError} from "~/server/utils/YuzuError";

export const categoryMap: Record<string, RegExp> = {
    game: /^g-/,
    technique: /^t-/,
    other: /^o-/
}

/**
 * 异步获取类别数据
 * 首先尝试从缓存中获取数据，如果缓存不存在，则从数据库中查询，并将结果缓存
 * @param category 类别字符串，用于指定需要获取数据的类别
 * @returns 返回类别数据数组，包含类别的主题数、浏览数和最新主题信息
 */
async function getCategoryData(category: string) {
    // 尝试从缓存中获取类别数据
    const categoryDataCache: CategoryResponseData[] | null = await useStorage('redis')
        .getItem(`category:${category}`) as CategoryResponseData[]
    if (categoryDataCache) {
        return categoryDataCache
    }

    // 如果缓存不存在，从数据库中查询类别数据
    const data: CategoryResponseData[] = await TopicModel.aggregate([
        {
            // 将每个文档中的'section'数组展开为多个文档
            $unwind: '$section'
        },
        {
            // 筛选出与给定类别匹配的文档
            $match: {
                section: categoryMap[category]
            }
        },
        {
            // 按'section'字段分组，计算每个分组的主题数、浏览数和最新主题
            $group: {
                _id: '$section',
                topics: {$sum: 1},
                views: {$sum: '$views'},
                latestTopic: {$last: '$ROOT'}
            }
        },
        {
            // 重新定义输出格式，包括每个分组的最新主题详情
            $project: {
                _id: 0,
                section: '$_id',
                topic: {
                    tid: '$latestTopic.tid',
                    title: '$latestTopic.title',
                    time: '$latestTopic.time'
                },
                topics: 1,
                views: 1
            }
        }
    ])
    // 将查询到的数据存入缓存
    await useStorage('redis').setItem(`category:${category}`, data, {ttl: 17 * 60})
    return data
}


export default defineEventHandler(async (event) => {
    const {category}: { category: string } = await getQuery(event)
    const availableCategories = Object.keys(categoryMap)
    if (!availableCategories.includes(category)) {
        return yuzuError(event, 10220)
    }
    return await getCategoryData(category)
})