import request from '@/middleware'
import { BaseResult } from '@/types/axios'
import { TutorOrder } from '@/types/tutorOrder'

// 添加批量更新状态的参数接口定义
interface BatchStatusParams {
  teacherId: number | null
  status: '已成交' | '未成交'
}

/**
 * 家教订单修改模块
 * 包含所有修改相关的API方法（增删改）
 */
export const mutationApis = {
  /**
   * 添加家教订单
   * @param data 订单数据，不包含id
   * @returns 返回添加结果
   */
  addTutor: (data: TutorOrder) => {
    return request.post<BaseResult>({
      url: '/api/manager/tutors/create',
      data
    })
  },

  /**
   * 更新订单信息
   * @param data 订单数据，必须包含id
   * @returns 返回更新结果
   */
  updateTutor: (data: TutorOrder) => {
    console.log('更新订单数据:', data)
    return request.put<BaseResult>({
      url: `/api/manager/tutors/update`,
      data: data
    })
    
  },

  /**
   * 删除订单
   * @param ids 要删除的订单ID或ID数组
   * @returns 返回删除结果
   */
  deleteTutor: (ids: number | number[]) => {
    // 确保 ids 始终是数组
    const idArray = Array.isArray(ids) ? ids : [ids]

    return request.post<BaseResult>({
      url: '/api/manager/tutors/delete',
      data: { ids: idArray }
    })
  },

  /**
   * 修改订单状态
   * @param ids 订单ID或ID数组
   * @param status 新状态值 (0: 隐藏, 1: 显示)
   * @returns 返回状态修改结果
   */
  updateTutorStatus: (ids: number | number[], status: 0 | 1) => {
    // 确保 ids 始终是数组
    const idArray = Array.isArray(ids) ? ids : [ids]
    
    return request.put<BaseResult>({
      url: `/api/manager/tutors/status`,
      data: { 
        ids: idArray, 
        status 
      }
    })
  },

  /**
   * 更新订单成交状态
   * @param ids 订单ID或ID数组
   * @param params 状态参数
   */
  updateOrderDealStatus: (ids: number | number[], params: {
    teacherId: number | null
    status: '已成交' | '未成交'
  }) => {
    // 确保 ids 始终是数组
    const idArray = Array.isArray(ids) ? ids : [ids]

    return request.put<BaseResult>({
      url: '/api/manager/tutors/deal',
      data: {
        ids: idArray,
        ...params
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
} 