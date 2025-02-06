import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {Tag} from "~/server/models/types/tag";

const TagSchema
    = new mongoose.Schema<Tag>(
    {
        tagId: { type: Number, unique: true },
        tid: { type: Number, require: true },
        rid: { type: Number, default: 0 },
        name: { type: String, require: true, maxlength: 17 },
        category: { type: [String], default: [] }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

TagSchema.pre('save', increasingSequence('tagId'))

export const TagModel
    = mongoose.model<Tag>('tag', TagSchema)