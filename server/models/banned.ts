import mongoose, {Schema} from "mongoose";
import {Banned} from "~/server/models/types/banned";

export const BannedSchema
    = new mongoose.Schema<Banned>(
    {
        bid: {type: Number, unique: true},
        uid: {type: Number, required: true},
        name: {type: String, require: true},
        description: {
            'en-us': {type: String, default: ''},
            'ja-jp': {type: String, default: ''},
            'zh-cn': {type: String, default: ''}
        },
        time: {type: Number, default: Date.now()},
        result: {type: Schema.Types.Mixed, required: true}
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

export const BannedModel
    = mongoose.model<Banned>('banned', BannedSchema)