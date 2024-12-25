import api from '@/middleware'
import { useUserStore } from '@/store/modules/user'
import type { City } from '@/config/cityConfig'

// 通知接口类型定义
export interface NotificationUpdateParams {
  id?: number
  title: string
  description: string
}

export interface NotificationResponse {
  code: number
  message: string
  data: {
    title: string
    description: string
  }
}

/**
 * 更新通知
 * @param params 通知参数
 */
export function updateNotification(params: NotificationUpdateParams) {
  return api.put<NotificationResponse>({
    url: '/api/manager/tutornotice/update',
    data: params
  })
}

/**
 * 获取通知详情
 * @param id 通知ID
 */
export function getNotificationDetail(id: number) {
  return api.get<NotificationResponse>({
    url: `/api/manager/tutornotice/detail/${id}`
  })
}

// 城市名称到代码的映射
const CITY_CODE_MAP: Record<City, string> = {
  '天津': 'tj',
  '北京': 'bj',
  '上海': 'sh',
  '西安': 'xa',
  '南京': 'nj',
  '武汉': 'wh'
}

/**
 * 获取最新通知
 */
export function getLatestNotification() {
  const userStore = useUserStore()
  const city = userStore.info?.userInfo?.city

  const headers: Record<string, string> = {}
  if (city) {
    const cityCode = CITY_CODE_MAP[city as City] || 'tj'
    headers['x-city'] = cityCode
  }

  return api.get<NotificationResponse>({
    url: '/api/teacher/tutornotice',
    headers
  })
}