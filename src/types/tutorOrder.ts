import { BaseResult } from '@/types/axios'
import type { QueryFilters } from './Filter'
import type { 
  TeachingType,
  StudentGrade,
  Subject,
  TeacherType,
  StudentLevel,
  Gender,
  OrderTag,
  City,
  District
} from '@/types/OrderOptions'

/**
 * 家教订单数据类型
 */
export interface TutorOrder {
  id?: number                 // 订单ID
  tutor_code: string         // 订单编号
  student_gender: Gender     // 学生性别
  teaching_type: TeachingType  // 教学类型
  student_grade: StudentGrade  // 学生年级
  subjects: Subject[]         // 补习科目（可多选）
  teacher_type: TeacherType[]  // 教师类型要求（可多选）
  teacher_gender: Gender[]     // 教师性别要求（可多选）
  order_tags: OrderTag[]      // 订单标签（可多选）
  city: City                 // 城市
  district: District<City>    // 区域，根据城市动态变化
  address: string           // 详细地址
  grade_score: string      // 现阶段成绩
  student_level: StudentLevel  // 学生水平
  tutoring_time: string     // 补习时间
  salary: string           // 课时费
  requirement_desc: string // 对老师要求
  subjects_desc: string   // 科目详细说明
  phone_number: string     // 联系电话
  order_source?: string    // 订单来源
  is_visible: boolean     // 是否可见
  status: '未成交' | '已成交' | '已过期'  // 订单状态
  created_at?: string      // 创建时间
  created_by?: number      // 创建人ID
  updated_at?: string      // 更新时间
  updated_by?: number      // 更新人ID
  is_deleted?: boolean     // 是否删除
  deleted_by?: number      // 删除人ID
  deleted_at?: string      // 删除时间
  order_count?: number     // 订单数量
  deal_time?: string       // 成交时间
  deal_teacher_id?: number // 成交教师ID
  deal_staff_id?: number   // 成交员工ID
  created_by_name?: string    // 创建人姓名
  updated_by_name?: string    // 更新人姓名
  deleted_by_name?: string    // 删除人姓名
  deal_teacher_name?: string  // 成交教师姓名
  deal_staff_name?: string    // 成交员工姓名
}

/**
 * 查询参数类型
 * 与后端 req.query 保持一致
 */
export interface tutorQueryParams {
  page?: number            // 页码，默认1
  pageSize?: number        // 每页条数，默认20
  keyword?: string         // 关键词搜索
  filters?: QueryFilters   // 添加筛选条件属性
}

/**
 * 列表响应类型
 */
export interface TutorResponse extends BaseResult {
  data: {
    list: TutorOrder[]
    total: number
  }
}