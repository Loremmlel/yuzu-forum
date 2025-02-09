import {RankingGetUserRequestData, RankingUsers, UserSortFieldRanking} from "~/types/api/ranking";
import {UserModel} from "~/server/models/user";
import {ErrorCode} from "~/code&message/errorCode";

/**
 * 异步获取用户排名信息
 * @param page 当前页码，用于分页查询
 * @param limit 每页限制返回的用户数量
 * @param sortField 排序字段，根据 UserSortFieldRanking 类型进行排序
 * @param sortOrder 排序顺序，'asc' 表示升序，'desc' 表示降序
 * @returns 返回一个 Promise，解析为用户排名信息数组
 */
async function getUserRanking(
    page: number,
    limit: number,
    sortField: UserSortFieldRanking,
    sortOrder: YuzuOrder) {
    const skip = (page - 1) * limit

    // 根据排序字段和顺序生成排序配置
    const sortOptions: Record<string, 1 | -1> = {
        [sortField]: sortOrder === 'asc' ? 1 : -1
    }

    const numberFiled = ['point', 'upvote', 'like']

    // 如果排序字段是数值类型，直接使用 find, sort, skip, limit 方法查询
    if (numberFiled.includes(sortField)) {
        const users = await UserModel.find()
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean()

        return users.map(user => ({
            uid: user.uid,
            name: user.name,
            avatar: user.avatar,
            field: user[sortField] as number
        }) as RankingUsers)
    }

    // 如果排序字段不是数值类型，使用 aggregate 方法进行聚合查询
    return UserModel.aggregate([
        // 展开排序字段，使其每个元素成为单独的文档
        {$unwind: `$${sortField}`},
        // 按用户 ID 分组，计算每个用户的排序字段总和
        {
            $group: {
                _id: '$_id',
                uid: {$first: '$uid'},
                name: {$first: '$name'},
                avatar: {$first: '$avatar'},
                [sortField]: {$sum: 1}
            }
        },
        {$sort: sortOptions},
        {$skip: skip},
        {$limit: limit},
        // 选择返回的字段，并重命名为 field
        {
            $project: {
                _id: 0,
                uid: 1,
                name: 1,
                avatar: 1,
                field: `$${sortField}`
            }
        }
    ]) as Promise<RankingUsers[]>
}


export default defineEventHandler(async (event) => {
    const {page, limit, sortField, sortOrder}: RankingGetUserRequestData = await getQuery(event)
    if (!page || !limit || !sortField || !sortOrder) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }
    if (limit !== '30') {
        return yuzuError(event, ErrorCode.CustomPaginationNotAllowed)
    }

    const rankingUserCache = await useStorage('redis')
        .getItem<RankingUsers[]>(`ranking:user:${page}:${limit}:${sortField}:${sortOrder}`)
    if (rankingUserCache) {
        return rankingUserCache
    }

    const users = await getUserRanking(Number(page), Number(limit), sortField, sortOrder)
    await useStorage('redis').setItem(`ranking:user:${page}:${limit}:${sortField}:${sortOrder}`,
        users,
        {ttl: 20 * 60})
    return users
})