import request from '@/middleware'
import { BaseResult } from '@/types/axios'
import { TutorType } from '@/types/tutorOrder'

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
  addTutor: (data: TutorType) => {
    return request.post<BaseResult>({
      url: '/api/manager/tutors/add',
      data
    })
  },

  /**
   * 更新订单信息
   * @param data 订单数据，必须包含id
   * @returns 返回更新结果
   */
  updateTutor: (data: TutorType) => {
    const { id, ...restData } = data
    
    return request.put<BaseResult>({
      url: `/api/manager/tutors/update/${id}`,
      data: restData
    })
    
  },

  /**
   * 删除订单
   * @param id 要删除的订单ID
   * @returns 返回删除结果
   */
  deleteTutor: (id: number) => {
    try {
      return request.del<BaseResult>({
        url: `/api/manager/tutors/delete/${id}`
      })
    } catch (error) {
      console.error('删除请求失败:', error)
      return Promise.reject(error)
    }
  },

  /**
   * 修改订单状态
   * @param id 订单ID
   * @param status 新状态值
   * @returns 返回状态修改结果
   */
  updateTutorStatus: (id: number, status: number) => {
    return request.put<BaseResult>({
      url: `/api/manager/tutors/status`,
      data: { id, status }
    })
  },

  /**
   * 更新订单成交状态
   */
  updateOrderDealStatus: (id: number, params: {
    teacherId?: number | null
    status: '已成交' | '未成交'
  }) => {

    return request.put<BaseResult>({
      url: `/api/manager/tutors/deal/${id}`,
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
} 