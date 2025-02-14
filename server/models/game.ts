import {Game} from "~/server/models/types/game";
import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";

const GameSchema
    = new mongoose.Schema<Game>(
    {
        gid: {type: Number, unique: true},
        vndbId: {type: String, required: true},
        uid: {type: Number, required: true},
        name: {
            'en-us': {type: String, default: '', maxlength: 100007},
            'ja-jp': {type: String, default: '', maxlength: 100007},
            'zh-cn': {type: String, default: '', maxlength: 100007}
        },
        banner: {type: String, default: '', maxlength: 1007},
        introduction: {
            'en-us': {type: String, default: '', maxlength: 100007},
            'ja-jp': {type: String, default: '', maxlength: 100007},
            'zh-cn': {type: String, default: '', maxlength: 100007}
        },

        time: {type: Number, default: 0},
        status: {type: Number, default: 0},
        views: {type: Number, default: 0},
        type: {type: [String], default: []},
        language: {type: [String], default: []},
        platform: {type: [String], default: []},
        contributor: {type: [Number], default: []},
        likes: {type: [Number], default: []},
        favorites: {type: [Number], default: []},

        series: {type: [Number], default: []},
        resources: {type: [Number], default: []},
        links: {type: [Number], default: []},
        histories: {type: [Number], default: []},
        comments: {type: [Number], default: []},

        alias: {type: [String], default: []},
        official: {type: [String], default: []},
        tags: {type: [String], default: []}
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

GameSchema.virtual('user', {
    ref: 'user',
    localField: 'uid',
    foreignField: 'uid'
})

GameSchema.pre('save', increasingSequence('gid'))

export const GameModel
    = mongoose.model<Game>('game', GameSchema)