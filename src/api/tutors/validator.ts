import type { TutorType } from '@/types/tutorOrder'

/**
 * 校验错误信息接口
 */
interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * 校验家教订单数据是否符合 TutorType 的要求
 * @param data 要校验的数据对象
 * @returns ValidationResult 校验结果
 */
export function validateTutorData(data: any): ValidationResult {
  const errors: string[] = []

  // 检查必需字段
  const requiredFields = {
    tutor_code: '订单编号',
    student_gender: '学生性别',
    teaching_type: '教学类型',
    student_grade: '学生年级',
    subjects: '补习科目',
    district: '区域',
    city: '城市',
    address: '详细地址',
    tutoring_time: '辅导时间',
    salary: '课时费'
  }

  // 检查必需字段是否存在
  for (const [field, label] of Object.entries(requiredFields)) {
    if (!data[field]) {
      errors.push(`缺少必需字段: ${label}`)
    }
  }

  // 检查字段类型和值
  if (data.student_gender && !['男', '女'].includes(data.student_gender)) {
    errors.push('学生性别必须是 "男" 或 "女"')
  }

  if (data.teaching_type && !['一对一', '一对多'].includes(data.teaching_type)) {
    errors.push('教学类型必须是 "一对一" 或 "一对多"')
  }

  const validGrades = ['幼儿', '小学', '初一', '初二', '初三', '高一', '高二', '高三', '其他']
  if (data.student_grade && !validGrades.includes(data.student_grade)) {
    errors.push(`学生年级必须是以下之一: ${validGrades.join(', ')}`)
  }

  if (data.subjects && !Array.isArray(data.subjects)) {
    errors.push('补习科目必须是数组格式')
  }

  const validDistricts = [
    '南开区', '和平区', '河西区', '河东区', 
    '河北区', '红桥区', '津南区', '滨海新区'
  ]
  if (data.district && !validDistricts.includes(data.district)) {
    errors.push(`区域必须是以下之一: ${validDistricts.join(', ')}`)
  }

  // 检查可选字段的值（如果存在的话）
  if (data.teacher_type && !['在职老师', '985学生', '无'].includes(data.teacher_type)) {
    errors.push('教师类型必须是 "在职老师"、"985学生" 或 "无"')
  }

  if (data.teacher_gender && !['男', '女', '无'].includes(data.teacher_gender)) {
    errors.push('教师性别必须是 "男"、"女" 或 "无"')
  }

  if (data.student_level && 
      !['优秀', '较好', '中等', '不及格'].includes(data.student_level)) {
    errors.push('学生水平必须是 "优秀"、"较好"、"中等" 或 "不及格"')
  }

  if (data.status && !['已成交', '未成交'].includes(data.status)) {
    errors.push('订单状态必须是 "已成交" 或 "未成交"')
  }

  // 检查布尔值字段
  if (data.is_visible !== undefined && typeof data.is_visible !== 'boolean') {
    errors.push('is_visible 必须是布尔值')
  }

  if (data.is_deleted !== undefined && typeof data.is_deleted !== 'boolean') {
    errors.push('is_deleted 必须是布尔值')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 使用示例：
 * 
 * const data = {
 *   tutor_code: "T001",
 *   student_gender: "男",
 *   // ... 其他字段
 * }
 * 
 * const result = validateTutorData(data)
 * if (!result.isValid) {
 *   console.error('数据验证失败:', result.errors)
 * }
 */ 