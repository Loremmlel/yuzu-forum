import {GameResource} from "~/server/models/types/gameResource";
import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";

const GameResourceSchema = new mongoose.Schema<GameResource>(
    {
        grid: { type: Number, unique: true },
        gid: { type: Number, required: true },
        uid: { type: Number, required: true },
        type: { type: String, default: '' },
        link: { type: [String], default: [] },
        language: { type: String, default: '' },
        platform: { type: String, default: '' },
        size: { type: String, default: '', maxlength: 107 },

        code: { type: String, default: '', maxlength: 1007 },
        password: { type: String, default: '', maxlength: 1007 },
        note: { type: String, default: '', maxlength: 1007 },

        time: { type: Number, default: 0 },
        status: { type: Number, default: 0 },
        likes: { type: [Number], default: [] }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

GameResourceSchema.virtual('user', {
    ref: 'user',
    localField: 'uid',
    foreignField: 'uid'
})

GameResourceSchema.virtual('game', {
    ref: 'game',
    localField: 'gid',
    foreignField: 'gid'
})

GameResourceSchema.pre('save', increasingSequence('grid'))

export const GameResourceModel
    = mongoose.model<GameResource>(
    'game_resource',
    GameResourceSchema
)