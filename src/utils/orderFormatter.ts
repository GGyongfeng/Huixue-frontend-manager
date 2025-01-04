import type { TutorOrder } from '@/types/tutorOrder'

/**
 * 格式化订单信息为可复制的文本
 * @param order 订单对象或索引
 * @returns 格式化后的文本
 */
export function formatOrderText(order: TutorOrder | null): string {
    if (!order) return ''

    // 构建订单文本
    const lines = [
        // 订单号
        `${order.tutor_code}号家教`,
        // 订单内容
        order.original_text || ''
    ]

    // 过滤掉空行并用换行符连接
    return lines
        .filter(line => line.trim())
        .join('\n')
}

// 为了保持向后兼容，添加别名
export const copyOrderAsText = formatOrderText 