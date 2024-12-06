import type { TutorType } from '@/types/tutorOrder'

// 格式化订单数据的工具函数
export const tutorUtils = {
  // 格式化时间
  formatTime(time: string | undefined) {
    if (!time) return ''
    return new Date(time).toLocaleString()
  },
  
  // 格式化薪资显示
  formatSalary(salary: string) {
    return `￥${salary}/小时`
  },
  
  // 获取状态标签类型
  getStatusType(status: string) {
    return status === '已成交' ? 'success' : 'warning'
  }
} 