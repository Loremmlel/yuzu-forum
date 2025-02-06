export interface MessageAdmin {
    maid: number
    time: number
    status: 'read' | 'unread'
    content: YuzuLanguage
    admin: YuzuUser
}
