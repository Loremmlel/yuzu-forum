import * as mongoose from "mongoose";
import {User} from "~/server/models/types/user";
import {increasingSequence} from "~/server/utils/increasingSequence";

const UserSchema
    = new mongoose.Schema<User>({
    uid: {type: Number, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    ip: {type: String, default: ''},
    avatar: {type: String, default: ''},
    roles: {type: Number, default: 1},
    status: {type: Number, default: 0},
    time: {type: Number, default: Date.now()},
    point: {type: Number, default: 1000},
    bio: {type: String, default: '', maxlength: 100},
    upvote: {type: Number, default: 0},
    like: {type: Number, default: 0},
    dislike: {type: Number, default: 0},

    dailyTopicCount: {type: Number, default: 0},
    dailyGameCount: {type: Number, default: 0},
    dailyImageCount: {type: Number, default: 0},
    dailyCheckIn: {type: Number, default: 0},

    friend: {type: [Number], default: []},
    followed: {type: [Number], default: []},
    follower: {type: [Number], default: []},
    reply: {type: [Number], default: []},
    comment: {type: [Number], default: []},

    topic: {type: [Number], default: []},
    likeTopic: {type: [Number], default: []},
    dislikeTopic: {type: [Number], default: []},
    upvoteTopic: {type: [Number], default: []},
    favoriteTopic: {type: [Number], default: []},

    game: {type: [Number], default: []},
    likeGame: {type: [Number], default: []},
    favoriteGame: {type: [Number], default: []},
    contributeGame: {type: [Number], default: []},

    gameResource: {type: [Number], default: []},
    likeGameResource: {type: [Number], default: []},
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}})

UserSchema.pre('save', increasingSequence('uid'))

export const UserModel
    = mongoose.model<User>('user', UserSchema)