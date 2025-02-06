import {TodoModel} from "~/server/models/todo";
import {GetTodoRequestData, Todo} from "~/types/api/updateLog";
import {yuzuError} from "~/server/utils/YuzuError";

async function getTodos(page: number, limit: number) {
    const skip = (page - 1) * limit
    const totalCount = await TodoModel.countDocuments().lean()

    const data = await TodoModel.find()
        .sort({todoId: -1})
        .skip(skip)
        .limit(limit)
        .lean()

    const todos: Todo[] = data.map(todo => ({
        todoId: todo.todoId,
        status: todo.status,
        content: todo.content,
        time: todo.time,
        completedTime: todo.completedTime
    }) as Todo)

    return {todos, totalCount}
}

export default defineEventHandler(async (event) => {
    const {page, limit}: GetTodoRequestData = await getQuery(event)
    if (!page || !limit) {
        return yuzuError(event, 10507)
    }
    if (limit !== '10') {
        return yuzuError(event, 10209)
    }

    return await getTodos(Number(page), Number(limit))
})