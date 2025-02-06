import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {Message} from "~/server/models/types/messageAdmin";

const MessageAdminSchema
    = new mongoose.Schema<Message>(
    {
        maid: { type: Number, unique: true },
        uid: { type: Number, required: true },
        time: { type: Number, default: 0 },
        content: {
            'en-us': { type: String, default: '' },
            'ja-jp': { type: String, default: '' },
            'zh-cn': { type: String, default: '' }
        },
        status: { type: String, default: 'unread' }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

MessageAdminSchema.virtual('user', {
    ref: 'user',
    localField: 'uid',
    foreignField: 'uid'
})

MessageAdminSchema.pre('save', increasingSequence('maid'))

export const MessageAdminModel
    = mongoose.model<Message>(
    'message_admin',
    MessageAdminSchema
)