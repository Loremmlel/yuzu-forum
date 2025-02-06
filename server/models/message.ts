import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {Message} from "~/server/models/types/message";

const MessageSchema
    = new mongoose.Schema<Message>(
    {
        mid: {type: Number, unique: true},
        senderUid: {type: Number, required: true},
        receiverUid: {type: Number, required: true},
        time: {type: Number, default: 0},
        tid: {type: Number, default: 0},
        gid: {type: Number, default: 0},
        content: {type: String, default: '', maxlength: 233},
        status: {type: String, default: 'unread'},
        type: {type: String, required: true}
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

MessageSchema.virtual('user', {
    ref: 'user',
    localField: 'senderUid',
    foreignField: 'uid'
})

MessageSchema.pre('save', increasingSequence('mid'))

export const MessageModel
    = mongoose.model<Message>('message', MessageSchema)