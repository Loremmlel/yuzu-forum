import mongoose from "mongoose";
import {GameHistory} from "~/server/models/types/gameHistory";
import {increasingSequence} from "~/server/utils/increasingSequence";

const GameHistorySchema
    = new mongoose.Schema<GameHistory>(
    {
        ghid: {type: Number, unique: true},
        gid: {type: Number, required: true},
        uid: {type: Number, required: true},
        time: {type: Number, default: 0},
        action: {type: String, default: ''},
        type: {type: String, default: ''},
        content: {type: String, default: '', max: 1007}
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

GameHistorySchema.virtual('user', {
    ref: 'user',
    localField: 'uid',
    foreignField: 'uid'
})

GameHistorySchema.pre('save', increasingSequence('ghid'))

export const GameHistoryModel
    = mongoose.model<GameHistory>(
    'game_history',
    GameHistorySchema
)