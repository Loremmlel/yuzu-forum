import mongoose from "mongoose";
import {Topic} from "~/server/models/types/topic";
import {increasingSequence} from "~/server/utils/increasingSequence";

const TopicSchema
    = new mongoose.Schema<Topic>(
    {
        tid: { type: Number, unique: true },
        title: { type: String, required: true, maxlength: 40 },
        content: { type: String, required: true, maxlength: 100007 },
        uid: { type: Number, required: true },
        tags: { type: [String], required: true },
        category: { type: [String], required: true },
        section: { type: [String], required: true },
        time: { type: Number, default: Date.now() },

        views: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        upvoteTime: { type: Number, default: 0 },

        upvotes: { type: [Number], default: [] },
        replies: { type: [Number], default: [] },
        likes: { type: [Number], default: [] },
        share: { type: [Number], default: [] },
        dislikes: { type: [Number], default: [] },
        favorites: { type: [Number], default: [] },

        // 0 - normal, 1 - banned, 2 - pinned, 3 - essential
        status: { type: Number, default: 0 },
        edited: { type: Number, default: 0 }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

TopicSchema.virtual('user', {
    ref: 'user',
    localField: 'uid',
    foreignField: 'uid'
})

TopicSchema.pre('save', increasingSequence('tid'))

export const TopicModel
    = mongoose.model<Topic>('topic', TopicSchema)