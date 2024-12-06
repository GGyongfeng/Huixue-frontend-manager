import request from '@/middleware'
import { ElLoading } from 'element-plus'
import { tutorQueryParams, TutorResponse, TutorType } from '@/types/tutorOrder'
import { BaseResult } from '@/types/axios'

/**
 * 家教订单查询模块
 * 包含所有查询相关的API方法
 */

// 参数转换函数
const transformParams = (params: tutorQueryParams) => {
  // console.log('转换前的参数:', params)
  
  const result: Record<string, string | number | string[]> = {
    page: params.page || 1,
    pageSize: params.pageSize || 20
  }
  
  // 添加关键词
  if (params.keyword) {
    result.keyword = params.keyword
  }
  
  // 处理筛选条件
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, values]) => {
      if (values.length > 0) {
        result[key] = values
      }
    })
  }
  
  // console.log('转换后的参数:', result)
  
  return result
}

export const queryApis = {
  /**
   * 获取家教订单列表
   * @param params 查询参数，包含分页、筛选条件等
   * @returns 返回订单列表数据和总数
   */
  getTutorList: async (params: tutorQueryParams) => {
    const transformedParams = transformParams(params)
    const loading = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
      const result = await request.get<TutorResponse>({
        url: '/api/manager/tutors/list',
        params: transformedParams
      })
      console.log("query.ts - 订单列表请求结果",result)
      return result
    } catch (error) {
      console.error('获取家教订单列表失败:', error)
      throw error
    } finally {
      loading.close()
    }
  },

  /**
   * 获取订单详情
   * @param id 订单ID
   * @returns 返回单个订单的详细信息
   */
  getTutorDetail: (id: number) => {
    return request.get<BaseResult & { data: TutorType }>({
      url: `/api/manager/tutors/detail/${id}`
    })
  }
} 