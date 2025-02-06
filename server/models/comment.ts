import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {Comment} from "~/server/models/types/comment";

const CommentSchema
    = new mongoose.Schema<Comment>(
    {
        cid: { type: Number, unique: true },
        rid: { type: Number, required: true },
        tid: { type: Number, required: true },
        cUid: { type: Number, required: true },
        toUid: { type: Number, required: true },
        content: { type: String, default: '', maxlength: 1007 },

        likes: { type: [Number], default: [] }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

CommentSchema.virtual('topic', {
    ref: 'topic',
    localField: 'tid',
    foreignField: 'tid'
})

CommentSchema.virtual('cUser', {
    ref: 'user',
    localField: 'cUid',
    foreignField: 'uid'
})

CommentSchema.virtual('toUser', {
    ref: 'user',
    localField: 'toUid',
    foreignField: 'uid'
})

CommentSchema.pre('save', increasingSequence('cid'))

export const CommentModel
    = mongoose.model<Comment>('comment', CommentSchema)