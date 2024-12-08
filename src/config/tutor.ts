// 订单相关配置

// 教学类型选项
export const TEACHING_TYPES = ['一对一', '一对多'] as const

// 学生年级选项
export const STUDENT_GRADES = [
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

// 补习科目选项
export const SUBJECTS = [
  '语文',
  '数学',
  '英语',
  '物理',
  '化学',
  '生物',
  '政治',
  '历史',
  '地理'
] as const

// 教师类型选项
export const TEACHER_TYPES = [
  '在职老师',
  '985学生',
  '无'
] as const

// 学生水平选项
export const STUDENT_LEVELS = [
  '优秀',
  '较好',
  '中等',
  '不及格'
] as const

// 订单标签选项
export const ORDER_TAGS = [
  '急单',
  '长期',
  '短期',
  '寒假',
  '暑假'
] as const

// 区域选项
export const DISTRICTS = [
  '南开区',
  '和平区',
  '河西区',
  '河东区',
  '河北区',
  '红桥区',
  '津南区',
  '滨海新区'
] as const

// 订单表单默认值
export const DEFAULT_ORDER_FORM = {
  tutor_code: '',
  student_gender: '男',
  teaching_type: '一对一',
  student_grade: '幼儿',
  subjects: [],
  teacher_type: '无',
  teacher_gender: '无',
  order_tags: [],
  city: '天津',
  district: '南开区',
  address: '',
  grade_score: '',
  student_level: '中等',
  tutoring_time: '',
  salary: '',
  phone_number: '',
  requirement_desc: '',
  is_visible: true,
  status: '未成交'
} as const 