import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {UpdateLog} from "~/server/models/types/updateLog";

const UpdateLogSchema
    = new mongoose.Schema<UpdateLog>(
    {
        upid: { type: Number, unique: true },
        type: { type: String, required: true },
        content: {
            'en-us': { type: String, default: '' },
            'ja-jp': { type: String, default: '' },
            'zh-cn': { type: String, default: '' }
        },
        time: { type: String, default: '' },
        version: { type: String, default: '' }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

UpdateLogSchema.pre('save', increasingSequence('upid'))

export const UpdateLogModel = mongoose.model<UpdateLog>(
    'update_log',
    UpdateLogSchema
)