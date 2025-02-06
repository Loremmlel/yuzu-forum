import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {ChatRoom} from "~/server/models/types/chatRoom";

const ChatRoomSchema
    = new mongoose.Schema<ChatRoom>(
    {
        crid: {type: Number, unique: true},
        name: {type: String, default: ''},
        avatar: {type: String, default: ''},
        type: {type: String, required: true},
        participants: {type: [Number], required: true},
        admins: {type: [Number], default: []},
        lastMessage: {
            content: {type: String, default: ''},
            time: {type: Number, default: 0},
            senderUid: {type: Number, default: 0},
            senderName: {type: String, default: ''}
        }
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

ChatRoomSchema.pre('save', increasingSequence('crid'))

export const ChatRoomModel
    = mongoose.model('chat_room', ChatRoomSchema)