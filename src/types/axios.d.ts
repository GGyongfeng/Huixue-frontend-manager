/**
 * axios 相关的类型定义文件
 * 这个文件定义了项目中所有 HTTP 请求和响应的基本类型结构
 * .d.ts 文件是 TypeScript 的类型声明文件，只包含类型信息，不包含实现
 */

/**
 * 错误消息显示模式的类型定义
 * @type 'none' - 不显示错误消息
 * @type 'modal' - 以模态框形式显示错误消息
 * @type 'message' - 以消息提示形式显示错误消息
 * @type undefined - 使用默认的错误显示方式
 * 
 * 使用示例：
 * const config = {
 *   errorMessageMode: 'modal' // 这个请求的错误将以模态框形式显示
 * }
 */
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

/**
 * HTTP 请求配置选项接口
 * 定义了发送请求时可以配置的各种选项
 */
export interface RequestOptions {
  /** 
   * 是否将参数拼接到 URL 中
   * @example
   * true: /api/users?id=1
   * false: 参数会放在请求体中
   */
  joinParamsToUrl?: boolean

  /** 
   * 是否自动格式化日期
   * @example
   * true: 日期会被转换为特定格式的字符串
   * false: 保持原始格式
   */
  formatDate?: boolean

  /** 
   * 是否转换响应数据
   * @example
   * true: 响应数据会经过处理（如去掉包装对象）
   * false: 返回原始响应数据
   */
  isTransformResponse?: boolean

  /** 
   * 是否返回原始响应数据
   * @example
   * true: 返回完整的 axios 响应对象
   * false: 只返回 response.data
   */
  isReturnNativeResponse?: boolean

  /** 
   * 是否添加接口前缀
   * @example
   * true: /api/users
   * false: /users
   */
  joinPrefix?: boolean

  /** 
   * API 基础路径
   * @example
   * 'http://api.example.com'
   */
  apiUrl?: string

  /** 
   * 错误消息显示模式
   * 决定请求错误时如何显示错误信息
   */
  errorMessageMode?: ErrorMessageMode

  /** 
   * 是否添加时间戳
   * @example
   * true: /api/users?_t=1623825453
   * false: /api/users
   */
  joinTime?: boolean

  /** 
   * 是否忽略取消令牌
   * 用于防止重复请求
   */
  ignoreCancelToken?: boolean

  /** 
   * 是否在请求中携带 token
   * @example
   * true: 请求头中会加入 Authorization: Bearer xxx
   */
  withToken?: boolean
}

/**
 * 基础响应结构接口
 * 定义了后端 API 返回数据的标准格式
 * 
 * @template T 响应数据的类型，默认为 any
 * 
 * @example
 * // 定义一个用户响应类型
 * interface UserResponse extends BaseResult<User> {
 *   data: User
 * }
 * 
 * // 使用
 * const response: UserResponse = await api.getUser()
 * if (response.code === 200) {
 *   const user = response.data
 * }
 */
export interface BaseResult<T = any> {
  /** 
   * 状态码
   * @example
   * 200: 成功
   * 400: 请求错误
   * 401: 未授权
   * 403: 禁止访问
   * 404: 未找到
   * 500: 服务器错误
   */
  code: number

  /** 
   * 响应消息
   * @example
   * "操作成功"
   * "参数错误"
   * "服务器内部错误"
   */
  message: string

  /** 
   * 实际响应数据
   * 类型由泛型 T 决定
   */
  data: T

  /** 
   * JWT token
   * 通常在登录接口中返回
   * @example
   * "eyJhbGciOiJIUzI1NiIs..."
   */
  token?: string
}

/**
 * 分页数据响应接口
 * 继承自基础响应结构，添加了分页相关的字段
 * 
 * @template T 分页数据的类型
 * 
 * @example
 * // 定义一个分页列表响应
 * interface UserListResponse extends PaginationResult<User[]> {
 *   data: User[]
 * }
 * 
 * // 使用
 * const response: UserListResponse = await api.getUserList({ page: 1 })
 * console.log(`总条数: ${response.total}`)
 * console.log(`当前页数据: ${response.data}`)
 */
export interface PaginationResult<T> extends BaseResult {
  /** 当前页码 */
  currentPage: number

  /** 每页显示条数 */
  pageSize: number

  /** 最后一页的页码 */
  lastPage: number

  /** 总记录数 */
  total: number

  /** 当前页的数据 */
  data: T
}
