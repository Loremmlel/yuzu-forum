import {Document} from "mongoose";

type PreSaveMiddleware<T extends Document> = (
    this: T,
    next: (error?: Error) => void
) => Promise<void>

/**
 * 自增序列
 * @param fieldName 字段名
 * @param startSeq 起始序列
 */
export function increasingSequence(fieldName: string, startSeq = 1): PreSaveMiddleware<any> {
    return async function (next) {
        if (!this.isNew) {
            return next()
        }

        try {
            const lastTopic = await this.constructor
                .findOne({}, {[fieldName]: 1})
                .sort({[fieldName]: -1})
            this[fieldName] = lastTopic ? (lastTopic[fieldName] as number) + 1 : startSeq
            next()
        } catch (error) {
            return next(error as Error)
        }
    }
}