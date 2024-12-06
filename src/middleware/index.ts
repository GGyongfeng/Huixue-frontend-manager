import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { router } from '@/router'
import { getErrorMessage } from './errorCode'

const axiosInstance = axios.create({
  timeout: 15000, // 请求超时时间(毫秒)
  baseURL: import.meta.env.VITE_API_URL, // API地址
  withCredentials: true, // 异步请求携带cookie
  transformRequest: [(data) => JSON.stringify(data)], // 请求数据转换为 JSON 字符串
  validateStatus: (status) => status >= 200 && status < 300, // 只接受 2xx 的状态码
  headers: {
    get: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    post: { 'Content-Type': 'application/json;charset=utf-8' }
  },
  transformResponse: [
    (data) => {
      // 响应数据转换
      try {
        return typeof data === 'string' && data.startsWith('{') ? JSON.parse(data) : data
      } catch {
        return data // 解析失败时返回原数据
      }
    }
  ]
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (request) => {
    // 打印请求信息
    console.log('=======================================')
    console.log('请求拦截器:', {
      URL: request.url,
      方法: request.method,
      数据: request.data,
      参数: request.params,
      请求头: request.headers
    })

    const userStore = useUserStore()
    const { token } = userStore.info

    if (token) {
      request.headers.set({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }

    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  // 第一个函数处理响应
  (response: AxiosResponse) => {
    const { code, message, data } = response.data

    // 处理成功响应
    if (code === 200) {
      return response
    }

    // 显示错误消息
    ElMessage.error(getErrorMessage(code, message))
    return Promise.reject(new Error(message))
  },
  
  // 第二个函数处理网络错误
  (error) => {
    console.log('响应错误:', error)
    const status = error.response?.status
    const errorMessage = error.response?.data?.message

    // 处理 401 认证错误
    if (status === 401) {
      const userStore = useUserStore()
      userStore.logOut()
      router.push('/login')
      ElMessage.error(getErrorMessage(401, errorMessage))
      return Promise.reject(error)
    }

    // 处理 HTTP 状态码错误
    if (status) {
      ElMessage.error(getErrorMessage(status, errorMessage))
      return Promise.reject(error)
    }

    // 处理其他错误
    if (axios.isCancel(error)) {
      console.log('repeated request: ' + error.message)
    } else {
      ElMessage.error(getErrorMessage(500, errorMessage || '请求超时或服务器异常'))
    }
    
    return Promise.reject(error)
  }
)

// 请求
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await axiosInstance.request<T>({ ...config })
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      // 可以在这里处理 Axios 错误
    }
    return Promise.reject(e)
  }
}

// API 方法集合
const api = {
  get<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'GET' }) // GET 请求
  },
  post<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'POST' }) // POST 请求
  },
  put<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'PUT' }) // PUT 请求
  },
  del<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'DELETE' }) // DELETE 请求
  }
}

export default api
