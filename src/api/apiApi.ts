import request from '@/middleware'
import { BaseResult } from '@/types/axios'

// api
export class ApiService {
  static getApiList(params: any) {
    return request.post<BaseResult>({
      url: '/api/getApiList',
      params
    })
  }
}
