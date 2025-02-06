import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {ChatMessage} from "~/server/models/types/chatMessage";

const ChatMessageSchema
    = new mongoose.Schema<ChatMessage>(
    {
        cmid: {type: Number, unique: true},
        chatroomName: {type: String, required: true},
        senderUid: {type: Number, required: true},
        receiverUid: {type: Number, default: 0},
        content: {type: String, default: '', maxlength: 1000},
        time: {type: Number, default: () => Date.now()},
        status: {type: String, default: 'pending'},
        isRecalled: {type: Boolean, default: false},
        recalledTime: {type: Number},
        readBy: {
            type: [
                {
                    uid: {type: Number, required: true},
                    readTime: {type: Number, required: true}
                }
            ],
            default: []
        },

        reactions: {
            type: [
                {
                    uid: {type: Number, required: true},
                    reaction: {type: String, required: true}
                }
            ],
            default: []
        }
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

ChatMessageSchema.pre('save', increasingSequence('cmid'))

ChatMessageSchema.virtual('user', {
    ref: 'user',
    localField: 'senderUid',
    foreignField: 'uid'
})

export const ChatMessageModel
    = mongoose.model('chat_message', ChatMessageSchema)