import { useTutorStore } from '@/store/modules/tutor'
import type { TutorOrder } from '@/types/tutorOrder'

/**
 * 将订单数据格式化为文本格式
 * @param orderId 订单ID
 * @returns 格式化后的文本
 */
export function formatOrderToText(orderId: number): string {
    const tutorStore = useTutorStore()
    const order = tutorStore.tutorList.find(item => item.id === orderId)
    
    if (!order) {
        throw new Error('未找到订单')
    }
    
    return formatOrder(order)
}

/**
 * 格式化订单对象为文本
 * @param order 订单对象
 * @returns 格式化后的文本
 */
function formatOrder(order: TutorOrder): string {
    const lines = [
        `${order.tutor_code}号家教`,
        `【学生性别】：${order.student_gender}`,
        `【学生年级】：${order.student_grade}`,
        `【补习科目】：${order.subjects_desc || '未填写'}`,
        `【现阶段成绩】：${order.grade_score || '未填写'}`,
        `【补习时间】：${order.tutoring_time || '未填写'}`,
        `【报价】：${order.salary || '未填写'}`,
        `【地址】：${order.city || ''}${order.district || ''}${order.address || ''}`,
        `【对老师要求】：${order.requirement_desc || '未填写'}`
    ]
    
    return lines.join('\n')
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise
 */
export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text)
        return Promise.resolve()
    } catch (err) {
        // 降级处理
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        return Promise.resolve()
    }
}

/**
 * 复制订单为文本
 * @param orderId 订单ID
 * @returns Promise
 */
export async function copyOrderAsText(orderId: number): Promise<void> {
    const text = formatOrderToText(orderId)
    return copyToClipboard(text)
} 