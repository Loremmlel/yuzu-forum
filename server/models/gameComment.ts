import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {GameComment} from "~/server/models/types/gameComment";

const GameCommentSchema
    = new mongoose.Schema<GameComment>(
    {
        gcid: {type: Number, unique: true},
        gid: {type: Number, required: true},
        cUid: {type: Number, required: true},
        toUid: {type: Number, default: 0},
        content: {type: String, default: '', maxlength: 1007},

        likes: {type: [Number], default: []}
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

GameCommentSchema.virtual('cUser', {
    ref: 'user',
    localField: 'cUid',
    foreignField: 'uid'
})

GameCommentSchema.virtual('toUser', {
    ref: 'user',
    localField: 'toUid',
    foreignField: 'uid'
})

GameCommentSchema.pre('save', increasingSequence('gcid'))

export const GameCommentModel
    = mongoose.model<GameComment>(
    'game_comment',
    GameCommentSchema
)