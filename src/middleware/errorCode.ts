import EmojiText from '../utils/emojo'

interface ErrorConfig {
    message: string
    emoji: keyof typeof EmojiText
}

// 错误码配置
export const errorCodeMap: Record<number, ErrorConfig> = {
    // 客户端错误 4xx
    400: {
        message: '请求参数错误',
        emoji: 400
    },
    401: {
        message: '未授权，请重新登录',
        emoji: 401
    },
    403: {
        message: '无权访问',
        emoji: 403
    },
    404: {
        message: '请求的资源不存在',
        emoji: 404
    },

    // 服务器错误 5xx
    500: {
        message: '服务器内部错误',
        emoji: 500
    },
    503: {
        message: '服务暂时不可用',
        emoji: 500
    },

    // 业务错误码
    1001: {
        message: '参数无效',
        emoji: 400
    },
    1002: {
        message: '数据不存在',
        emoji: 400
    },
    1003: {
        message: '操作失败',
        emoji: 400
    }
}

// 获取错误配置
export const getErrorConfig = (code: number): ErrorConfig => {
    return errorCodeMap[code] || {
        message: '未知错误',
        emoji: 500
    }
}

// 生成错误消息
export const getErrorMessage = (code: number, message?: string): string => {
    const config = getErrorConfig(code)
    return `${message || config.message} ${EmojiText[config.emoji]}`
} 