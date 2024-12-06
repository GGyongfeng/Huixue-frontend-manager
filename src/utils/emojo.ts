/**
 * 表情配置
 * 用于在消息提示时显示对应的表情
 *
 * 用法
 * ElMessage.success(`${EmojiText[200]} 图片上传成功`)
 * ElMessage.error(`${EmojiText[400]} 图片上传失败`)
 * ElMessage.error(`${EmojiText[500]} 图片上传失败`)
 */

// emoji 表情配置
const EmojiText = {
  // 成功状态
  200: '🎉', // 成功

  // 客户端错误 4xx
  400: '❌', // 错误请求
  401: '🔒', // 未授权
  403: '⛔', // 禁止访问
  404: 'T_T', // 未找到资源

  // 服务器错误 5xx
  500: '💔', // 服务器内部错误
  503: '🔧', // 服务不可用

  // 业务错误码
  1001: '⚠️', // 参数无效
  1002: '❓', // 数据不存在
  1003: '🚫'  // 操作失败
}

// 备用表情
// const EmojiIcon = ['🟢', '🔴', '🟡', '🚀', '✨', '💡', '🛠️', '🔥', '🎉', '🌟', '🌈']

export default EmojiText
