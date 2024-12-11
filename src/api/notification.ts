import api from '@/middleware'

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

/**
 * 获取最新通知
 */
export function getLatestNotification() {
  return api.get<NotificationResponse>({
    url: '/api/teacher/tutornotice'
  })
}