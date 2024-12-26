// 订单相关配置

// 教学类型选项
export const TEACHING_TYPES = ['一对一', '一对多'] as const


// 教师类型选项
export const TEACHER_TYPES = [
  '在职老师',
  '985学生',
  '无'
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
  city: '',
  district: '',
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