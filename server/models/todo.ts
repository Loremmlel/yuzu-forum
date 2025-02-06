import {increasingSequence} from "~/server/utils/increasingSequence";
import mongoose from "mongoose";
import {Todo} from "~/server/models/types/todo";

const TodoSchema
    = new mongoose.Schema<Todo>(
    {
        todoId: {type: Number, unique: true},
        status: {type: Number, default: 0},
        content: {
            'en-us': {type: String, default: ''},
            'ja-jp': {type: String, default: ''},
            'zh-cn': {type: String, default: ''}
        },
        time: {type: Number, default: Date.now()},
        completedTime: {type: Number, default: 0}
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

TodoSchema.pre('save', increasingSequence('todoId'))

export const TodoModel
    = mongoose.model<Todo>('todo', TodoSchema)