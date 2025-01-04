import { CITY_DISTRICTS } from '@/config/cityConfig'

// 定义常量和类型
const TEACHING_TYPES = ['一对一', '一对多'] as const
const STUDENT_GRADES = [
  '幼儿',
  '小学',
  '初一',
  '初二',
  '初三',
  '高一',
  '高二',
  '高三',
  '其他'
] as const

const SUBJECTS = [
  '语文',
  '数学',
  '英语',
  '物理',
  '化学',
  '生物',
  '政治',
  '历史',
  '地理',
  '国际课程',
  '信息技术',
  '乐器'
] as const

const TEACHER_TYPES = [
  '在职老师',
  '985学生'
] as const

const STUDENT_LEVELS = [
  '优秀',
  '较好',
  '中等',
  '不及格'
] as const

const GENDER_OPTIONS = ['男', '女'] as const

const ORDER_TAGS = [
  '专职单子',
  '好单子',
  '加急单子',
  '特殊单子',
  '长期',
  '短期',
  '寒假',
  '暑假'
] as const

const DISTRICTS: typeof CITY_DISTRICTS = CITY_DISTRICTS

// 导出类型
export type TeachingType = typeof TEACHING_TYPES[number]
export type StudentGrade = typeof STUDENT_GRADES[number]
export type Subject = typeof SUBJECTS[number]
export type TeacherType = typeof TEACHER_TYPES[number]
export type StudentLevel = typeof STUDENT_LEVELS[number]
export type Gender = typeof GENDER_OPTIONS[number]
export type OrderTag = typeof ORDER_TAGS[number]
export type City = keyof typeof DISTRICTS
export type District<C extends City = '天津'> = typeof DISTRICTS[C][number]

// 导出配置对象
export const ORDER_ITEM_OPTIONS = {
  teaching_types: TEACHING_TYPES,
  student_grades: STUDENT_GRADES,
  subjects: SUBJECTS,
  teacher_types: TEACHER_TYPES,
  student_levels: STUDENT_LEVELS,
  gender_options: GENDER_OPTIONS,
  order_tags: ORDER_TAGS,
  districts: DISTRICTS
}

// 订单表单默认选项
export const getDefaultOrderSelection = (userCity: City = '天津') => ({
  tutor_code: '',
  student_gender: '男' as Gender,
  teaching_type: '一对一' as TeachingType,
  student_grade: '' as StudentGrade,
  subjects: [] as Subject[],
  teacher_type: [] as TeacherType[],
  teacher_gender: [] as Gender[],
  order_tags: [] as OrderTag[],
  city: userCity,
  district: DISTRICTS[userCity][0],
  address: '',
  grade_score: '',
  student_level: '中等' as StudentLevel,
  tutoring_time: '',
  salary: '',
  phone_number: '',
  requirement_desc: '',
  subjects_desc: '',
  order_source: '',
  is_visible: true,
  status: '未成交' as const
})