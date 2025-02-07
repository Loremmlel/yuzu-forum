import {TagModel} from "~/server/models/tag";
import mongoose from "mongoose";

export async function createTagsByTidAndRid(
    tid: number,
    rid: number,
    tags: string[],
    category: string[]
) {
    const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags)
    const deduplicatedTags = [...new Set(tagsArray)]
    const createdTags = []

    for (const tagName of deduplicatedTags) {
        const newTag = new TagModel({name: tagName, tid, rid, category})
        const savedTag = await newTag.save()
        createdTags.push(savedTag)
    }
    return createdTags
}

export async function updateTagsByTidAndRid(
    tid: number,
    rid: number,
    tags: string[],
    category: string[]
) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const tagsArray = tags
        const existingTags = await TagModel.find({tid, rid})
        const existingTagNames = existingTags.map(tag => tag.name)
        const tagsToAdd = tagsArray.filter(tag => !existingTagNames.includes(tag))
        const tagsToRemove = existingTagNames.filter(tag => !tagsArray.includes(tag))
        await createTagsByTidAndRid(tid, rid, tagsToAdd, category)
        for (const tagToRemove of tagsToRemove) {
            await TagModel.deleteOne({tid, rid, name: tagToRemove})
        }
        await session.commitTransaction()
    } catch (err) {
        await session.abortTransaction()
        throw err
    } finally {
        await session.endSession()
    }
}