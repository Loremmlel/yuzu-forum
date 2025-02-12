export enum ErrorCode {
    // 没有错误
    NoError = 0,
    UnknownError = 9999,

    // 用户相关
    // 用户不存在
    UserNotFound = 10101,
    // 密码错误
    UserPasswordIncorrect = 10102,
    // 邮箱验证码错误
    EmailVerificationCodeIncorrect = 10103,
    // 邮箱已注册
    EmailAlreadyRegistered = 10104,
    // 用户名已注册
    UsernameAlreadyRegistered = 10105,
    // 用户签名过长
    UserSignatureTooLong = 10106,
    // 用户凭证错误
    InvalidUserCredentials = 10107,
    // 密码格式错误
    InvalidPasswordFormat = 10108,
    // 邮箱或验证码格式错误
    InvalidEmailOrVerificationCodeFormat = 10109,
    // 图片上传错误
    ImageUploadEmptyError = 10110,
    // 图片压缩后大小超过限制
    CompressedImageSizeExceeded = 10111,
    // 登录冷却
    LoginCooldown = 10112,
    // 注册冷却
    RegistrationCooldown = 10113,
    // 无效的用户UID
    InvalidUserUID = 10114,
    // 登录过期
    LoginExpired = 10115,
    // 未知图片上传错误
    UnknownImageUploadError = 10116,
    // 无效的用户名更新
    InvalidUsernameUpdate = 10117,
    // 点数不足
    InsufficientPoints = 10118,
    // 今日已签到
    AlreadyCheckedInToday = 10119,
    // 封禁
    UserBanned = 10120,
    // 无效的举报类型
    InvalidReportType = 10121,
    // 举报理由为空
    EmptyReportReason = 10122,
    // 举报内容过长
    ReportContentTooLong = 10123,

    // 话题相关
    // 今日发布话题达到上限
    DailyTopicLimitExceeded = 10201,
    // 点数不足
    InsufficientPointsForPushTopic = 10202,
    // 标题太长或为空
    TopicTitleTooLongOrEmpty = 10204,
    // 内容太长或为空
    TopicContentTooLongOrEmpty = 10205,
    // 标签数量超过限制
    InvalidTagCount = 10206,
    // 分类数量超过限制
    InvalidCategoryCount = 10207,
    // 时间戳无效
    InvalidTopicTimestamp = 10208,
    // 自定义分页不允许
    CustomPaginationNotAllowed = 10209,
    // 获取话题ID失败
    TopicIdReadFailed = 10210,
    // 话题不存在
    TopicNotFound = 10211,
    // 已点赞
    AlreadyLikedTopic = 10212,
    // 已点踩
    AlreadyDislikedTopic = 10213,
    // 图片大小超过限制
    ImageSizeExceeded = 10214,
    // 图片压缩后大小超过限制
    CompressedImageSizeExceededLimit = 10215,
    // 图片上传数组错误
    ImageUploadArrayError = 10216,
    // 图片上传次数超过限制
    DailyImageUploadLimit = 10217,
    // 无效的分类选择
    InvalidCategorySelection = 10218,
    // 分区数量超过限制
    InvalidSectionCount = 10219,
    // 无效的请求参数
    InvalidRequestParameters = 10220,
    // 已收藏
    AlreadyFavoritedTopic = 10221,
    // 无效的分区选择
    InvalidTopicSection = 10222,
    // 评论内容太长或为空
    CommentContentTooLongOrEmpty = 10223,
    // 评论不存在
    CommentNotFound = 10224,

    // 邮件相关
    // 发送邮件冷却
    EmailSendCooldown = 10301,
    // 无效的邮箱格式
    InvalidEmailFormat = 10302,
    // 无效的邮箱凭证
    InvalidEmailCredentials = 10303,
    // 邮箱未注册
    EmailNotRegistered = 10304,

    // 私信相关
    // 不能给自己发消息
    CannotSendMessageToSelf = 10401,

    // 回复相关
    // 回复标签数量超过限制
    ReplyTagLimitExceeded = 10501,
    // 回复标签长度超过限制
    ReplyTagTooLong = 10502,
    // 回复内容为空
    EmptyReplyContent = 10503,
    // 回复内容长度超过限制
    ReplyContentTooLong = 10504,
    // 无效的回复时间戳
    InvalidReplyTimestamp = 10505,
    // 回复不存在
    ReplyNotFound = 10506,
    // 无效的请求参数或缺少参数
    InvalidRequestParametersOrMissing = 10507,
    // 点数不足
    InsufficientPointsForPushReply = 10508,
    // 已点赞
    AlreadyLikedReply = 10509,
    // 已点踩
    AlreadyDislikedReply = 10510,

    // 游戏相关
    // VNDB ID 必填
    VNDBIdRequired = 10601,
    // 必填字段为空或格式错误
    InvalidVNDBIdFormat = 10602,
    // 标题长度超过限制
    InvalidTitleLength = 10603,
    // 预览图大小超过限制
    PreviewImageSizeExceeded = 10605,
    // 描述长度超过限制
    InvalidDescriptionLength = 10606,
    // 游戏发布达到上限
    DailyGameLimitExceeded = 10607,
    // 重复的 VNDB ID
    DuplicateVNDBEntry = 10608,
    // 获取游戏ID失败
    GameIdReadFailed = 10609,
    // 游戏不存在
    GameNotFound = 10610,
    // 别名数量超过限制
    AliasCountExceeded = 10611,
    // 别名长度超过限制
    AliasTooLong = 10612,
    // 无效的资源类型
    InvalidResourceType = 10613,
    // 资源链接数量超过限制
    ResourceLinkRequiredOrExceededMax = 10614,
    // 资源链接长度超过限制
    ResourceLinkTooLong = 10615,
    // 无效的资源语言
    InvalidResourceLanguage = 10616,
    // 无效的资源平台
    InvalidResourcePlatform = 10617,
    // 无效的资源大小格式
    InvalidResourceSizeFormat = 10618,
    // 资源提取密码长度超过限制
    ResourceCodeTooLong = 10619,
    // 资源解压密码长度超过限制
    ResourcePasswordTooLong = 10620,
    // 资源备注长度超过限制
    ResourceNoteTooLong = 10621,
    // 资源链接不存在
    ResourceLinkNotFound = 10622,
    // 无权限操作资源
    NoPermissionForResource = 10623,
    // 已点赞
    AlreadyLikedResource = 10624,
    // 资源链接已过期
    ResourceLinkExpired = 10625,
    // 链接名称长度超过限制
    LinkNameTooLong = 10626,
    // 链接长度超过限制
    LinkTooLong = 10627,
    // 链接不存在
    GameLinkNotFound = 10628,
    // 官方链接长度超过限制
    OfficialLinkTooLong = 10629,
    // 无效的 GID
    InvalidGameGID = 10630,
    // 拒绝理由必填
    RejectionReasonRequired = 10631,
    // 无权限操作更新请求
    NoPermissionForUpdateRequest = 10632,
    // 更新请求已处理
    UpdateRequestAlreadyProcessed = 10633,
    // 评论内容长度超过限制
    CommentContentTooLong = 10634,
    // 引擎名称长度超过限制
    EngineNameTooLong = 10635,
    // 无效的链接格式
    InvalidLinkFormat = 10636,
    // 官方网站数量超过限制
    OfficialWebsiteLimitExceeded = 10637,
    // 引擎数量超过限制
    EngineCountExceeded = 10638,
    // 无权限删除评论
    NoPermissionDeleteComment = 10639,
    // 无权限更新预览图
    NoPermissionUpdatePreview = 10640,
    // 游戏已存在
    GameAlreadyExists = 10641,
    // 标签数量超过限制
    TagCountExceeded = 10642,
    // 标签名称长度超过限制
    TagNameTooLong = 10643,
    // 无变化被检测
    NoChangesDetected = 10644
}