export interface Todo {
    todoId: number
    status: number
    content: YuzuLanguage
    time: number
    completedTime: number

    created: Date
    updated: Date
}