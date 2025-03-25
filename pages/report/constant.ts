export const reportSection = [
    "topic",
    "reply",
    "comment",
    "user",
    "game",
    "gameComment",
] as const // 添加 as const可以确保ts把类型推断为数组元素联合类型而不是string[]

export type ReportType = typeof reportSection[number]