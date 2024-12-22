import type { TutorOrder } from '@/types/tutorOrder'
import { TutorsService } from '@/api/tutors'
import { useTutorStore } from '@/store/modules/tutor'
import { ElMessage } from 'element-plus'

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

/**
 * 刷新订单列表
 * @returns Promise
 */
export async function refreshTutorList() {
    const tutorStore = useTutorStore()
    
    try {
        const res = await TutorsService.getTutorList(tutorStore.searchParams)
        
        if (res.code === 200) {
            // 确保每条数据都有状态值
            const list = res.data.list.map(item => ({
                ...item,
                status: item.status || '未成交'  // 设置默认状态
            }))
            
            // store 赋值
            tutorStore.setTutorList(list)
            tutorStore.setTotal(res.data.total)
            
            return res
        }
    } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
        throw error
    }
} 