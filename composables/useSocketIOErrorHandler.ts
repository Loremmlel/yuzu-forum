const ERROR_MESSAGES = {
    'socket:error:1': {
        'en-us': 'User ID is missing, please log in again',
        'ja-jp': 'ユーザーIDが見つかりません。再度ログインしてください',
        'zh-cn': '用户 ID 丢失，请重新登录'
    },
    'socket:error:2': {
        'en-us': 'Invalid user socket, please refresh the page.',
        'ja-jp': '無効なユーザー接続です。ページを更新してください',
        'zh-cn': '无效的用户连接，请刷新页面'
    },
    'socket:error:3': {
        'en-us': 'Cannot send a message to yourself.',
        'zh-cn': '不能给自己发送消息',
        'ja-jp': '自分にメッセージを送信することはできません'
    },
    'socket:error:4': {
        'en-us': 'The maximum message length cannot exceed 1007 characters',
        'zh-cn': '消息最大长度不可超过 1007 个字符',
        'ja-jp': 'メッセージの最大長は1007文字を超えてはなりません'
    }
}

export function useSocketIOErrorHandler() {
    const socket = useSocketIO()
    onMounted(() => {
        socket.on('socket:error:1', () => {
            useMessage(ERROR_MESSAGES['socket:error:1'], 'error')
        })
        socket.on('socket:error:2', () => {
            useMessage(ERROR_MESSAGES['socket:error:2'], 'error')
        })
        socket.on('socket:error:3', () => {
            useMessage(ERROR_MESSAGES['socket:error:3'], 'error')
        })
        socket.on('socket:error:4', () => {
            useMessage(ERROR_MESSAGES['socket:error:4'], 'error')
        })
    })
}