import { queryApis } from './query'
import { mutationApis } from './mutation'
import type { TutorType, tutorQueryParams } from '@/types/tutorOrder'

/**
 * 家教订单模块的统一入口文件
 * 整合了所有的查询和修改接口，对外提供统一的服务类
 */

// 导出类型定义，供其他模块使用
export type { TutorType, tutorQueryParams }

/**
 * 家教订单服务类
 * 提供所有与家教订单相关的操作方法
 */
export class TutorsService {
  /** 获取订单列表 */
  static readonly getTutorList = queryApis.getTutorList
  /** 获取订单详情 */
  static readonly getTutorDetail = queryApis.getTutorDetail
  /** 添加新订单 */
  static readonly addTutor = mutationApis.addTutor
  /** 更新订单信息 */
  static readonly updateTutor = mutationApis.updateTutor
  /** 删除订单 */
  static readonly deleteTutor = mutationApis.deleteTutor
  /** 更新订单状态 */
  static readonly updateTutorStatus = mutationApis.updateTutorStatus
}
