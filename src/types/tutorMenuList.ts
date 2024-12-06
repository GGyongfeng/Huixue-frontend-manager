import type { TutorType } from './tutorOrder'

// 选择类型
type SelectType = 'multiple' | 'none'

// 四字标签的统一宽度
const FOUR_CHAR_LABEL_WIDTH = 110

// 表格列的配置类型
export interface TableColumn {
  prop: string
  label: string
  width?: number
  fixed?: boolean | 'left' | 'right'
  formatter?: (row: TutorType) => string
  slot?: string   // 可选的插槽名称
  visible?: boolean  // 控制列的显示/隐藏
  comment?: string   // 注释说明
  select?: {
    type: SelectType  // 选择类型：单选/多选/无
    options: string[] // 可选值列表
  }
}

// 所有可能的列配置
export const ALL_COLUMNS: TableColumn[] = [
  { 
    prop: 'tutor_code', 
    label: '订单编号', 
    width: 120,
    visible: true,
    comment: '订单的唯一编号'
  },
  { 
    prop: 'student_gender', 
    label: '学生性别', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '学生的性别',
    select: {
      type: 'multiple',
      options: ['男', '女']
    }
  },
  { 
    prop: 'teaching_type', 
    label: '教学类型', 
    width: 120,
    visible: true,
    comment: '一对一或一对多',
    select: {
      type: 'multiple',
      options: ['一对一', '一对多']
    }
  },
  { 
    prop: 'student_grade', 
    label: '学生年级', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '学生所在年级',
    select: {
      type: 'multiple',
      options: ['幼儿', '小学', '初一', '初二', '初三', '高一', '高二', '高三', '其他']
    }
  },
  { 
    prop: 'subjects', 
    label: '补习科目', 
    width: FOUR_CHAR_LABEL_WIDTH,
    formatter: (row: TutorType) => Array.isArray(row.subjects) ? row.subjects.join('、') : row.subjects,
    visible: true,
    comment: '需要补习的科目',
    select: {
      type: 'multiple',
      options: ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治']
    }
  },
  { 
    prop: 'teacher_type', 
    label: '教师类型', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '期望的教师类型',
    select: {
      type: 'multiple',
      options: ['在职老师', '985学生', '无']
    }
  },
  { 
    prop: 'teacher_gender', 
    label: '教师性别', 
    width:  FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '期望的教师性别',
    select: {
      type: 'multiple',
      options: ['男', '女', '无']
    }
  },
  { 
    prop: 'district', 
    label: '区域', 
    width: 90,
    visible: true,
    comment: '所在区域',
    select: {
      type: 'multiple',
      options: ['南开区', '和平区', '河西区', '河东区', '河北区', '红桥区', '津南区', '滨海新区']
    }
  },
  { 
    prop: 'city', 
    label: '城市', 
    width: 90,
    visible: true,
    comment: '所在城市'
  },
  { 
    prop: 'address', 
    label: '地址', 
    width: 200,
    visible: true,
    comment: '详细地址'
  },
  { 
    prop: 'grade_score', 
    label: '成绩情况', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '学生当前成绩'
  },
  { 
    prop: 'student_level', 
    label: '学生水平', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '学生整体水平',
    select: {
      type: 'multiple',
      options: ['优秀', '较好', '中等', '不及格']
    }
  },
  { 
    prop: 'tutoring_time', 
    label: '辅导时间', 
    width: 150,
    visible: true,
    comment: '期望的辅导时间'
  },
  { 
    prop: 'salary', 
    label: '课时费', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '每小时费用'
  },
  { 
    prop: 'is_visible', 
    label: '可见状态', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '是否对外可见',
    select: {
      type: 'multiple',
      options: ['1', '0']
    }
  },
  { 
    prop: 'status', 
    label: '订单状态', 
    width: FOUR_CHAR_LABEL_WIDTH,
    slot: 'status',
    visible: true,
    comment: '订单成交状态',
    select: {
      type: 'multiple',
      options: ['已成交', '未成交']
    }
  },
  { 
    prop: 'created_at', 
    label: '创建时间', 
    width: 180,
    formatter: (row: TutorType) => {
      if (!row.created_at) return ''
      return new Date(row.created_at).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    },
    visible: true,
    comment: '创建时间'
  },
  { 
    prop: 'created_by_name', 
    label: '创建人', 
    width: 100,
    visible: true,
    comment: '创建人姓名'
  },
  { 
    prop: 'updated_at', 
    label: '更新时间', 
    width: 180,
    formatter: (row: TutorType) => {
      if (!row.updated_at) return ''
      return new Date(row.updated_at).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    },
    visible: true,
    comment: '最后更新时间'
  },
  { 
    prop: 'updated_by_name', 
    label: '更新人', 
    width: 100,
    visible: true,
    comment: '更新人姓名'
  },
  { 
    prop: 'deal_staff_name', 
    label: '成交员工', 
    width: 100,
    visible: true,
    comment: '成交员工姓名'
  },
  { 
    prop: 'deal_teacher_name', 
    label: '成交教师', 
    width: 100,
    visible: true,
    comment: '成交教师姓名'
  },
  { 
    prop: 'operation', 
    label: '操作', 
    width: 160,
    fixed: 'right',
    slot: 'operation',
    visible: true,
    comment: '操作按钮'
  }
]

// 默认显示的列（从所有列中选择）
export const DEFAULT_COLUMNS: TableColumn[] = ALL_COLUMNS.filter(col => 
  ['tutor_code', 'student_grade', 'subjects', 'status', 'created_at','city','district', 'operation'].includes(col.prop)
)

// 表格配置
export interface TableConfig {
  columns: TableColumn[]
  showPagination?: boolean
  pageSize?: number
  border?: boolean
  stripe?: boolean
}

// 导出默认配置
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  columns: DEFAULT_COLUMNS,
  showPagination: true,
  pageSize: 20,
  border: true,
  stripe: true
} 