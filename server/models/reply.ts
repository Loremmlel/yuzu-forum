import mongoose from "mongoose";
import {Reply} from "~/server/models/types/reply";
import {increasingSequence} from "~/server/utils/increasingSequence";

const ReplySchema
    = new mongoose.Schema<Reply>(
    {
        rid: { type: Number, unique: true },
        tid: { type: Number, required: true },
        rUid: { type: Number, required: true },
        toUid: { type: Number, required: true },
        floor: { type: Number, default: 0 },
        toFloor: { type: Number, default: 0 },
        tags: { type: [String], default: [] },
        time: { type: Number, default: 0 },
        edited: { type: Number, default: 0 },
        content: { type: String, default: '', maxlength: 10007 },
        upvoteTime: { type: Number, default: 0 },

        upvotes: { type: [Number], default: [] },
        likes: { type: [Number], default: [] },
        dislikes: { type: [Number], default: [] },
        share: { type: [Number], default: [] },
        comment: { type: [String], default: [] }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

ReplySchema.virtual('topic', {
    ref: 'topic',
    localField: 'tid',
    foreignField: 'tid'
})

ReplySchema.virtual('rUser', {
    ref: 'user',
    localField: 'rUid',
    foreignField: 'uid'
})

ReplySchema.virtual('toUser', {
    ref: 'user',
    localField: 'toUid',
    foreignField: 'uid'
})

ReplySchema.pre('save', increasingSequence('rid'))

export const ReplyModel
    = mongoose.model<Reply>('reply', ReplySchema)