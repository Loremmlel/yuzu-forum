import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {GamePR} from "~/server/models/types/gamePR";

const GamePRSchema
    = new mongoose.Schema<GamePR>(
    {
        gprid: { type: Number, unique: true },
        gid: { type: Number, required: true },
        uid: { type: Number, required: true },
        status: { type: Number, default: 0 },
        index: { type: Number, default: 0 },
        completedTime: { type: Number, default: 0 },
        note: { type: String, default: '', maxlength: 1007 },
        game: {}
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

GamePRSchema.virtual('user', {
    ref: 'user',
    localField: 'uid',
    foreignField: 'uid'
})

GamePRSchema.pre('save', increasingSequence('gprid'))

export const GamePRModel
    = mongoose.model<GamePR>('game_pr', GamePRSchema)