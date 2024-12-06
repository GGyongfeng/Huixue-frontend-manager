import request from '@/middleware'
import { BaseResult } from '@/types/axios'
import { LoginParams } from './model/loginModel'
import axios from 'axios'

export class UserService {
  // 登录
  static async login(params: LoginParams) {
    try {
      const result = await request.post<BaseResult>({
        url: '/api/manager/users/login',
        data:params
      })
      
      // 如果登录成功，设置 token 到请求头
      if (result.code === 200 && result.data?.token) {
        // 在拦截器中设置 token，而不是在这里设置
        return result
      }
      
      return result
    } catch (error) {
      console.error('登录请求失败:', error)
      throw error
    }
  }
}
