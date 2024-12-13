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

const DISTRICTS = {
  '天津': [
    '和平区',
    '河东区',
    '河西区',
    '南开区',
    '河北区',
    '红桥区',
    '东丽区',
    '西青区',
    '津南区',
    '北辰区',
    '武清区',
    '宝坻区',
    '滨海新区',
    '宁河区',
    '静海区',
    '蓟州区',
    '线上',
    '其他'
  ] as const,
  
  '北京': [
    '东城区',
    '西城区',
    '朝阳区',
    '丰台区',
    '石景山区',
    '海淀区',
    '门头沟区',
    '房山区',
    '大兴区',
    '通州区',
    '顺义区',
    '昌平区',
    '怀柔区',
    '平谷区',
    '密云区',
    '延庆区',
    '线上',
    '其他'
  ] as const,

  '西安': [
    '新城区',
    '碑林区',
    '莲湖区',
    '灞桥区',
    '未央区',
    '雁塔区',
    '阎良区',
    '临潼区',
    '长安区',
    '高陵区',
    '鄠邑区',
    '线上',
    '其他'
  ] as const,

  '上海': [
    '黄浦区',
    '徐汇区',
    '长宁区',
    '静安区',
    '普陀区',
    '虹口区',
    '杨浦区',
    '浦东新区',
    '闵行区',
    '宝山区',
    '嘉定区',
    '金山区',
    '松江区',
    '青浦区',
    '奉贤区',
    '崇明区',
    '线上',
    '其他'
  ] as const,

  '南京': [
    '玄武区',
    '秦淮区',
    '建邺区',
    '鼓楼区',
    '栖霞区',
    '雨花台区',
    '江宁区',
    '浦口区',
    '六合区',
    '溧水区',
    '高淳区',
    '线上',
    '其他'
  ] as const,

  '武汉': [
    '江岸区',
    '江汉区',
    '硚口区',
    '汉阳区',
    '武昌区',
    '青山区',
    '洪山区',
    '东西湖区',
    '蔡甸区',
    '江夏区',
    '黄陂区',
    '新洲区',
    '汉南区',
    '线上',
    '其他'
  ] as const
} as const

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
  student_grade: '幼儿' as StudentGrade,
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