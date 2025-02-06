import mongoose from "mongoose";
import {GameLink} from "~/server/models/types/gameLink";
import {increasingSequence} from "~/server/utils/increasingSequence";

const GameLinkSchema
    = new mongoose.Schema<GameLink>(
    {
        gid: { type: Number, required: true },
        glid: { type: Number, unique: true },
        uid: { type: Number, required: true },
        name: { type: String, default: '', maxlength: 107 },
        link: { type: String, default: '', maxlength: 233 }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

GameLinkSchema.virtual('user', {
    ref: 'user',
    localField: 'uid',
    foreignField: 'uid'
})

GameLinkSchema.pre('save', increasingSequence('glid'))

export const GameLinkModel
    = mongoose.model<GameLink>(
    'game_link',
    GameLinkSchema
)