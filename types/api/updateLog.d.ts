export interface GetTodoRequestData {
    page: string
    limit: string
}

export interface GetUpdateLogRequestData {
    page: string
    limit: string
}

export type UpdateType =
    'feat'
    | 'pref'
    | 'fix'
    | 'styles'
    | 'mod'
    | 'chore'
    | 'sec'
    | 'refactor'
    | 'docs'
    | 'test'

export interface Todo {
    todoId: number
    status: number
    content: YzLanguage
    time: number
    completedTime: number
}

export interface UpdateLog {
    upid: number
    type: UpdateType
    content: YzLanguage
    time: string
    version: string
}
